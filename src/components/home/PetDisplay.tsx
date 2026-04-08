import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Bubble from "@/components/ui/Bubble";
import MobileBubble from "@/components/home/MobileBubble";
import PetAppearance from "@/components/inventory/PetAppearance";
import { PetEmotion, PetType } from "@/types/pet";
import { Appearance } from "@/db/models/pet";
import {
  PillIcon,
  LiquidIcon,
  InjectionIcon,
} from "@/components/ui/modals/medicationIcons";

interface PetDisplayProps {
  petType: PetType;
  appearance: Appearance;
  emotion?: PetEmotion;
  selectedFood: string | null;
  bubbleText?: string;
  bubbleAnimation?: "jump" | "none";
  onFoodDrop?: (distance: number | null) => void;
  onDrag?: (distance: number | null) => void;
  medicationType?: "Pill" | "Syrup" | "Shot" | null;
  shouldShowMedicationDrag?: boolean;
  onMedicationDrop?: (distance: number | null) => void;
  onMedicationDrag?: (distance: number | null) => void;
}

const PetDisplay: React.FC<PetDisplayProps> = ({
  petType,
  appearance,
  emotion = PetEmotion.NEUTRAL,
  selectedFood,
  bubbleText,
  bubbleAnimation = "none",
  onFoodDrop,
  onDrag,
  medicationType,
  shouldShowMedicationDrag,
  onMedicationDrop,
  onMedicationDrag,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);
  const medicationRef = useRef<HTMLDivElement>(null);

  const getDistanceFromLeft = (element: HTMLDivElement | null) => {
    const constraintsRect = constraintsRef.current?.getBoundingClientRect();
    const elementRect = element?.getBoundingClientRect();

    if (!constraintsRect || !elementRect) {
      return null;
    }

    const elementCenterX = elementRect.left + elementRect.width / 2;
    return elementCenterX - constraintsRect.left;
  };

  const handleDrag = () => {
    if (!onDrag) return;
    onDrag(getDistanceFromLeft(foodRef.current));
  };

  const handleFoodDragEnd = () => {
    const distance = getDistanceFromLeft(foodRef.current);
    onDrag?.(distance);
    onFoodDrop?.(distance);
  };

  const handleMedicationDrag = () => {
    if (!onMedicationDrag) return;
    onMedicationDrag(getDistanceFromLeft(medicationRef.current));
  };

  const handleMedicationDragEnd = () => {
    const distance = getDistanceFromLeft(medicationRef.current);
    onMedicationDrag?.(distance);
    onMedicationDrop?.(distance);
  };

  const getMedicationIcon = (type: "Pill" | "Syrup" | "Shot") => {
    switch (type) {
      case "Pill":
        return <PillIcon className="w-full h-full" />;
      case "Syrup":
        return <LiquidIcon className="w-full h-full" />;
      case "Shot":
        return <InjectionIcon className="w-full h-full" />;
      default:
        return <PillIcon className="w-full h-full" />;
    }
  };

  const jumpAnimation =
    bubbleAnimation === "jump"
      ? {
          y: [0, -20, 0],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 1.5,
          },
        }
      : {};

  return (
    <div className="fixed bottom-[190px] left-1/2 w-full -translate-x-1/2 desktop:bottom-auto desktop:left-1/3 desktop:top-[60%] desktop:h-[45%] desktop:max-h-[40rem] desktop:w-fit desktop:-translate-x-1/2 desktop:-translate-y-1/2">
      <div className="relative w-full">
        <motion.div animate={jumpAnimation}>
          <PetAppearance
            appearance={appearance}
            petType={petType}
            emotion={emotion}
            selectedItem={null}
            className="mx-auto w-[112px] smallTablet:w-[120px] tablet:w-[128px] desktop:mx-0 desktop:w-[330px] desktop:short:w-[300px] desktop:minimized:w-[270px] desktop:tiny:w-[240px] largeDesktop:w-[350px]"
            showBackground={false}
          />
        </motion.div>
        <div className="absolute bottom-[108%] left-1/2 -translate-x-1/2 desktop:bottom-[75%] desktop:left-[90%] desktop:translate-x-0">
          <div className="desktop:hidden">
            <MobileBubble text={bubbleText} animation={bubbleAnimation} />
          </div>
          <div className="hidden desktop:block">
            <Bubble text={bubbleText} animation={bubbleAnimation} />
          </div>
        </div>
        <div
          ref={constraintsRef}
          className="absolute bottom-[30%] right-[2%] h-[110px] w-[150px] rotate-6 tablet:bottom-[28%] tablet:right-[4%] tablet:h-[110px] tablet:w-[190px] desktop:bottom-[30%] desktop:right-[-45%] desktop:h-[100px] desktop:w-[275px] desktop:rotate-12"
        ></div>
        {selectedFood && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            ref={foodRef}
            dragElastic={0.1}
            dragMomentum={false}
            whileTap={{ cursor: "grabbing" }}
            className="absolute bottom-[34%] right-[6%] z-[25] h-[120px] w-[120px] tablet:bottom-[30%] tablet:right-[8%] desktop:bottom-[25%] desktop:right-[-50%] desktop:h-[150px] desktop:w-[150px]"
            style={{ cursor: "grab" }}
            onDrag={handleDrag}
            onDragEnd={handleFoodDragEnd}
          >
            <Image
              src={`/foods/${selectedFood.toLowerCase()}.svg`}
              alt={selectedFood}
              fill
              className="object-contain"
              style={{ pointerEvents: "none" }}
            />
          </motion.div>
        )}
        {shouldShowMedicationDrag && medicationType && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            ref={medicationRef}
            dragElastic={0.1}
            dragMomentum={false}
            whileTap={{ cursor: "grabbing" }}
            className="absolute bottom-[34%] right-[6%] z-[25] flex h-[120px] w-[120px] items-center justify-center tablet:bottom-[30%] tablet:right-[8%] desktop:bottom-[25%] desktop:right-[-50%] desktop:h-[150px] desktop:w-[150px]"
            style={{ cursor: "grab" }}
            onDrag={handleMedicationDrag}
            onDragEnd={handleMedicationDragEnd}
          >
            <div style={{ pointerEvents: "none" }}>
              {getMedicationIcon(medicationType)}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PetDisplay;
