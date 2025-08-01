// import React, { useState } from 'react';
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Box,
//   Typography,
//   Grid
// } from '@mui/material';

// const serviceColors = [
//   "#fc4c4c",
//   "#f57f31",
//   "#ffb41f",
//   "#8949b1",
//   "#8949b1",
//   "#126ab8",
//   "#5d4037",
//   "#9c9c9c",
//   "#068f86",
//   "#27912b",
//   "#76ff03"
// ];

// export default function ColorPicker() {
//   const [selectedColor, setSelectedColor] = useState(serviceColors[0]); // Set first color as default

//   const handleColorChange = (event) => {
//     // Add validation to ensure we get a proper value
//     if (event?.target?.value && serviceColors.includes(event.target.value)) {
//       setSelectedColor(event.target.value);
//     } else {
//       console.warn('Invalid color selection:', event.target.value);
//     }
//   };

//   return (
//     <FormControl fullWidth sx={{ mt: 2, minWidth: 120 }}>
//       <InputLabel shrink={Boolean(selectedColor)}>Color</InputLabel>
//       <Select
//         value={selectedColor}
//         label="Color"
//         onChange={handleColorChange}
//         displayEmpty
//         inputProps={{ 'aria-label': 'Select color' }}
//         renderValue={(selected) => {
//           if (!selected) return <em>Select a color</em>;
//           return (
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Box
//                 sx={{
//                   width: 24,
//                   height: 24,
//                   borderRadius: '50%',
//                   backgroundColor: selected,
//                   border: '1px solid #ccc'
//                 }}
//               />
//               <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
//                 {selected}
//               </Typography>
//             </Box>
//           );
//         }}
//         sx={{
//           '& .MuiSelect-select': {
//             display: 'flex',
//             alignItems: 'center'
//           }
//         }}
//       >
//         <Grid container spacing={1} sx={{ p: 2, width: 280 }}>
//           {serviceColors.map((color, index) => (
//             <Grid item xs={2.4} key={`${color}-${index}`}>
//               <MenuItem 
//                 value={color}
//                 sx={{ 
//                   padding: '8px',
//                   '&:hover': {
//                     backgroundColor: 'action.hover'
//                   }
//                 }}
//               >
//                 <Box sx={{ 
//                   display: 'flex', 
//                   flexDirection: 'column', 
//                   alignItems: 'center',
//                   width: '100%'
//                 }}>
//                   <Box
//                     sx={{
//                       width: 24,
//                       height: 24,
//                       borderRadius: '50%',
//                       backgroundColor: color,
//                       border: '1px solid #ccc',
//                       mb: 0.5,
//                     //   ...(color === selectedColor && {
//                     //     border: '2px solid #000',
//                     //     boxShadow: '0 0 0 1px #fff inset'
//                     //   })
//                     }}
//                   />
//                   <Typography 
//                     variant="caption" 
//                     sx={{ 
//                       fontFamily: 'monospace',
//                       fontSize: '0.75rem'
//                     }}
//                   >
//                     {color}
//                   </Typography>
//                 </Box>
//               </MenuItem>
//             </Grid>
//           ))}
//         </Grid>
//       </Select>
//     </FormControl>
//   );
// }