import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Bubble from "@/components/ui/Bubble";
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
    <div className="fixed mobile:left-[25%] mobile:top-[75%] tablet:left-1/3 tablet:top-[60%] transform -translate-x-1/2 -translate-y-1/2 h-[45%] max-h-[40rem] w-fit">
      <div className="relative w-full">
        <motion.div animate={jumpAnimation}>
          <PetAppearance
            appearance={appearance}
            petType={petType}
            emotion={emotion}
            selectedItem={null}
            className="short:w-[300px] minimized:w-[270px] tiny:w-[240px] largeDesktop:w-[350px] desktop:w-[330px] tablet:w-[300px]"
            showBackground={false}
          />
        </motion.div>
        <div className="absolute bottom-[90%] left-[90%] tablet:bottom-[75%]">
          <Bubble text={bubbleText} animation={bubbleAnimation} />
        </div>
        <div
          ref={constraintsRef}
          className="absolute bottom-[30%] -right-[45%] rotate-12 w-[275px] h-[100px]"
        ></div>
        {selectedFood && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            ref={foodRef}
            dragElastic={0.1}
            dragMomentum={false}
            whileTap={{ cursor: "grabbing" }}
            className="absolute bottom-[25%] right-[-50%] z-[25]"
            style={{
              width: 150,
              height: 150,
              cursor: "grab",
            }}
            onDrag={handleDrag}
            onDragEnd={handleFoodDragEnd}
          >
            <Image
              src={`/foods/${selectedFood.toLowerCase()}.svg`}
              alt={selectedFood}
              width={150}
              height={150}
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
            className="absolute bottom-[25%] right-[-50%] z-[25] flex items-center justify-center"
            style={{
              width: 150,
              height: 150,
              cursor: "grab",
            }}
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
