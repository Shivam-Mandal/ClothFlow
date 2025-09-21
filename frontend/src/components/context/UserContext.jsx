// import React, { createContext, useState, useEffect, useRef } from 'react';
// import api from '../../api/api';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [accessToken, setAccessToken] = useState(null);

//   const isRefreshing = useRef(false);
//   const failedQueue = useRef([]);

//   const processQueue = (error, token = null) => {
//     failedQueue.current.forEach(prom => {
//       if (error) prom.reject(error);
//       else prom.resolve(token);
//     });
//     failedQueue.current = [];
//   };

//   // Interceptors setup only once
//   useEffect(() => {
//     const reqInterceptor = api.interceptors.request.use(
//       (config) => {
//         if (accessToken) {
//           config.headers['Authorization'] = 'Bearer ' + accessToken;
//         }
//         return config;
//       },
//       (err) => Promise.reject(err)
//     );

//     const resInterceptor = api.interceptors.response.use(
//       res => res,
//       async (err) => {
//         const originalRequest = err.config;
//         if (err.response?.status === 401 && !originalRequest._retry) {
//           if (isRefreshing.current) {
//             return new Promise((resolve, reject) => {
//               failedQueue.current.push({ resolve, reject });
//             }).then(token => {
//               originalRequest.headers['Authorization'] = 'Bearer ' + token;
//               return api(originalRequest);
//             });
//           }

//           originalRequest._retry = true;
//           isRefreshing.current = true;

//           return new Promise(async (resolve, reject) => {
//             try {
//               const r = await api.post('/auth/refresh');
//               const newToken = r.data.accessToken;
//               setAccessToken(newToken);
//               processQueue(null, newToken);
//               originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
//               resolve(api(originalRequest));
//             } catch (refreshError) {
//               processQueue(refreshError, null);
//               setUser(null);
//               setAccessToken(null);
//               reject(refreshError);
//             } finally {
//               isRefreshing.current = false;
//             }
//           });
//         }

//         return Promise.reject(err);
//       }
//     );

//     return () => {
//       api.interceptors.request.eject(reqInterceptor);
//       api.interceptors.response.eject(resInterceptor);
//     };
//   }, [accessToken]);

//   // On mount: restore session
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.post('/auth/refresh');
//         setAccessToken(res.data.accessToken);
//         const profile = await api.get('/me');
//         setUser(profile.data.user);
//       } catch {
//         setUser(null);
//         setAccessToken(null);
//       }
//     })();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
//       const { accessToken, user } = res.data;
//       console.log("accessToken",accessToken)
//       console.log("user",user)
//       setAccessToken(accessToken);
//       setUser(user);

//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("user", JSON.stringify(user));

//       return { success: true, user };
//     } catch (err) {
//       return {
//         success: false,
//         message: err.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post("/auth/logout", {}, { withCredentials: true });
//       setUser(null);
//       setAccessToken(null);
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("user");
//       return { success: true };
//     } catch (err) {
//       return {
//         success: false,
//         message: err.response?.data?.message || "Logout failed",
//       };
//     }
//   };

//   return (
//     <UserContext.Provider value={{ user, accessToken, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;


import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../../api/api"; // assume this is an axios instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // keep token in a ref so interceptors use always-current token without re-registering
  const tokenRef = useRef(null);
  useEffect(() => { tokenRef.current = accessToken; }, [accessToken]);

  const isRefreshing = useRef(false);
  const failedQueue = useRef([]);

  const processQueue = (error, token = null) => {
    failedQueue.current.forEach(p => {
      if (error) p.reject(error);
      else p.resolve(token);
    });
    failedQueue.current = [];
  };

  // Register interceptors once on mount
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      config => {
        const token = tokenRef.current;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = "Bearer " + token;
        }
        // ensure credentials are sent if backend expects cookie-based refresh
        // (If your api instance already sets withCredentials: true, you can omit)
        config.withCredentials = true;
        return config;
      },
      err => Promise.reject(err)
    );

    const resInterceptor = api.interceptors.response.use(
      res => res,
      async err => {
        // guard: some network errors have no config
        const originalRequest = err?.config;
        if (!originalRequest) return Promise.reject(err);

        // Avoid infinite loop: mark retried requests
        if (err.response?.status === 401 && !originalRequest._retry) {
          // if another refresh is in progress, queue this request
          if (isRefreshing.current) {
            return new Promise((resolve, reject) => {
              failedQueue.current.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = "Bearer " + token;
              return api(originalRequest);
            });
          }

          originalRequest._retry = true;
          isRefreshing.current = true;

          return new Promise(async (resolve, reject) => {
            try {
              // call refresh with credentials so server can read HttpOnly cookie
              const r = await api.post("/auth/refresh", {}, { withCredentials: true });
              const newToken = r.data?.accessToken;
              if (!newToken) throw new Error("No accessToken in refresh response");

              setAccessToken(newToken);    // this updates state + tokenRef via effect above
              processQueue(null, newToken);

              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = "Bearer " + newToken;

              resolve(api(originalRequest));
            } catch (refreshError) {
              processQueue(refreshError, null);
              setUser(null);
              setAccessToken(null);
              // optionally clear localStorage here if you store tokens
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");
              reject(refreshError);
            } finally {
              isRefreshing.current = false;
            }
          });
        }

        return Promise.reject(err);
      }
    );

    // eject interceptors on unmount
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // On mount: restore session by calling refresh then getting profile
  useEffect(() => {
    (async () => {
      try {
        // Make sure to send credentials (cookie) if server uses cookie refresh
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data?.accessToken;
        if (!newToken) throw new Error("No accessToken from refresh");

        setAccessToken(newToken); // tokenRef updated by the other effect
        // now token is set so request to /me will include Authorization header via interceptor
        const profile = await api.get("/me");
        setUser(profile.data?.user ?? null);

        // optional: persist access token & user (if you want)
        localStorage.setItem("accessToken", newToken);
        if (profile.data?.user) localStorage.setItem("user", JSON.stringify(profile.data.user));
      } catch (e) {
        // not logged in / refresh failed
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      // send credentials so server can set refresh cookie
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
      const { accessToken: at, user: u } = res.data;
      if (!at) throw new Error("No accessToken returned on login");

      setAccessToken(at);
      setUser(u || null);

      localStorage.setItem("accessToken", at);
      if (u) localStorage.setItem("user", JSON.stringify(u));

      return { success: true, user: u };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Login failed"
      };
    }
  };

  const logout = async () => {
    try {
      // tell backend to clear refresh cookie
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Logout failed"
      };
    }
  };

  return (
    <UserContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
