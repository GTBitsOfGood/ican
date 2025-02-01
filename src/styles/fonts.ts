import { Quantico } from "next/font/google";
// import localFont from "next/font/local";

export const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-quantico",
});

// export const berlinSansFB = localFont({
//   src: [
//     {
//       path: "../fonts/BerlinSansFBRegular.woff",
//       weight: "400",
//       style: "normal",
//     },
//     { path: "../fonts/BerlinSansFBBold.woff", weight: "700", style: "normal" },
//   ],
//   variable: "--font-berlin-sans-fb",
// });
