// // src/context/StyleContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import * as styleService from "../services/styleServices";

// const StyleContext = createContext();

// export const StyleProvider = ({ children }) => {
//   const [styles, setStyles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchStyles = async () => {
//     setLoading(true);
//     setError(null);
//     const res = await styleService.getAllStyles();
//     if (res.success) setStyles(res.data);
//     else setError(res.message);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchStyles();
//   }, []);

//   const createNewStyle = async (name, steps = []) => {
//     setLoading(true);
//     setError(null);
//     const res = await styleService.createStyle({ name, steps });
//     if (res.success) {
//       // append returned style
//       setStyles((s) => [res.data, ...s]);
//     } else setError(res.message);
//     setLoading(false);
//     return res;
//   };

//   const updateExistingStyle = async (id, payload) => {
//     setLoading(true);
//     setError(null);
//     const res = await styleService.updateStyle(id, payload);
//     if (res.success) {
//       setStyles((prev) => prev.map((p) => (p._id === id || p.id === id ? res.data : p)));
//     } else setError(res.message);
//     setLoading(false);
//     return res;
//   };

//   const patchStyleSteps = async (id, payload) => {
//     setLoading(true);
//     setError(null);
//     const res = await styleService.patchSteps(id, payload);
//     if (res.success) {
//       setStyles((prev) => prev.map((p) => (p._id === id || p.id === id ? res.data : p)));
//     } else setError(res.message);
//     setLoading(false);
//     return res;
//   };

//   const removeStyle = async (id) => {
//     setLoading(true);
//     setError(null);
//     const res = await styleService.deleteStyle(id);
//     if (res.success) {
//       setStyles((prev) => prev.filter((p) => p._id !== id && p.id !== id));
//     } else setError(res.message);
//     setLoading(false);
//     return res;
//   };

//   // Optional: helper to toggle a single step index for a style (calls patchSteps)
//   const toggleStep = async (styleId, stepIndex) => {
//     const style = styles.find((s) => s._id === styleId || s.id === styleId);
//     if (!style) return { success: false, message: "Style not found" };
//     // build new steps array
//     const newSteps = Array.isArray(style.steps) ? [...style.steps] : style.checks?.map((c, i) => ({ enabled: !!c })) || [];
//     // If steps are booleans (legacy), convert to objects
//     if (newSteps.length && typeof newSteps[0] !== "object") {
//       for (let i = 0; i < newSteps.length; i++) {
//         newSteps[i] = { enabled: !!newSteps[i] };
//       }
//     }
//     // toggle enabled
//     if (!newSteps[stepIndex]) return { success: false, message: "Index out of range" };
//     newSteps[stepIndex].enabled = !newSteps[stepIndex].enabled;
//     // send replaced steps array to server
//     return await patchStyleSteps(styleId, { steps: newSteps });
//   };

//   return (
//     <StyleContext.Provider
//       value={{
//         styles,
//         loading,
//         error,
//         fetchStyles,
//         createNewStyle,
//         updateExistingStyle,
//         patchStyleSteps,
//         removeStyle,
//         toggleStep,
//         setStyles, // optional: advanced usage
//       }}
//     >
//       {children}
//     </StyleContext.Provider>
//   );
// };

// export default StyleContext;
