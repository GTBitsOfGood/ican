import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Bubble from "@/components/ui/Bubble";
import PetAppearance from "@/components/inventory/PetAppearance";
import { PetType } from "@/types/pet";
import { Appearance } from "@/db/models/pet";

interface PetDisplayProps {
  petType: PetType;
  appearance: Appearance;
  selectedFood: string | null;
  bubbleText?: string;
  onFoodDrop?: () => void;
  onDrag?: (distance: number | null) => void;
}

const PetDisplay: React.FC<PetDisplayProps> = ({
  petType,
  appearance,
  selectedFood,
  bubbleText,
  onFoodDrop,
  onDrag,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);

  const handleDrag = () => {
    if (!onDrag) return;
    if (constraintsRef.current) {
      const constraintsRect = constraintsRef?.current?.getBoundingClientRect();
      const foodRect = foodRef?.current?.getBoundingClientRect();
      if (constraintsRect && foodRect) {
        const foodCenterX = foodRect.left + foodRect.width / 2;
        const distanceFromLeft = foodCenterX - constraintsRect.left;
        onDrag(distanceFromLeft);
      }
    }
  };

  return (
    <div className="fixed mobile:left-[25%] mobile:top-[75%] tablet:left-1/3 tablet:top-[60%] transform -translate-x-1/2 -translate-y-1/2 h-[45%] max-h-[40rem] w-fit">
      <div className="relative w-full">
        <PetAppearance
          appearance={appearance}
          petType={petType}
          selectedItem={null}
          className="short:w-[300px] minimized:w-[270px] tiny:w-[240px] largeDesktop:w-[350px] desktop:w-[330px] tablet:w-[300px]"
          showBackground={false}
        />
        <div className="absolute bottom-[90%] left-[90%] tablet:bottom-[75%]">
          <Bubble text={bubbleText} />
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
            onMouseUp={onFoodDrop}
            onMouseLeave={onFoodDrop}
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
      </div>
    </div>
  );
};

export default PetDisplay;
