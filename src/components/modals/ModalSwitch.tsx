import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalSwitchProps {
  state: boolean;
  setState: (value: boolean) => void;
}

export default function ModalSwitch({ state, setState }: ModalSwitchProps) {
  return (
    <AnimatePresence mode="wait">
      <div
        onClick={() => setState(!state)}
        className="flex cursor-pointer justify-between items-center mobile:w-[20%] tablet:w-[17%] desktop:w-[14%] largeDesktop:w-[26%] h-12 py-2 px-[0.75rem] border-2 border-black"
      >
        {state ? (
          <>
            <motion.p
              key="text1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg text-[#1E2353]"
            >
              ON
            </motion.p>
            <motion.div
              key="box1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="w-[1.5rem] h-[1.5rem] bg-icanGreen-300"
            />
          </>
        ) : (
          <>
            <motion.div
              key="box2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-[1.5rem] h-[1.5rem] bg-icanBlue-100"
            ></motion.div>
            <motion.p
              key="text2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg text-black"
            >
              OFF
            </motion.p>
          </>
        )}
      </div>
    </AnimatePresence>
  );
}

// export default function ModalSwitch({ state, setState }: ModalSwitchProps) {
//   return (
//     <div className="flex mobile:w-[20%] tablet:w-[13%] desktop:w-[9.5%] h-12 py-2 px-[0.75rem] border-2 border-white items-center">
//       <div
//         className="relative w-full h-full cursor-pointer"
//         onClick={() => setState(!state)}
//       >
//         {/* Slider Button */}
//         <div
//           className={`absolute left-0 cursor-pointer my-[0.125rem] w-[1.5rem] h-[1.5rem] transition-transform duration-300 ${state ? "bg-icanGreen-300" : "bg-icanBlue-100"}`}
//           style={{
//             transform: state ? "translateX(calc(100% - 1.75rem))" : "translateX(0)",
//           }}
//         ></div>

//         {/* Text */}
//         <p className={`absolute text-lg ${state ? "left-2" : "right-2"}`}>
//           {state ? "ON" : "OFF"}
//         </p>
//       </div>
//     </div>
//   );
// }
