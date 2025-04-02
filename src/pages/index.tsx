import Bubble from "@/components/ui/Bubble";
import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileInfo from "@/components/ui/ProfileInfo";
import ProfilePicture from "@/components/ui/ProfilePicture";

import SettingsModal from "@/components/modals/SettingsModal";
import ChangePinModal from "@/components/modals/ChangePinModal";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import AddMedicationModal from "@/components/modals/medication/addMedicationModal";
import EditMedicationModal from "@/components/modals/medication/editMedicationModal";
import { WithId } from "@/types/models";
import { Medication } from "@/db/models/medication";
import LoadingScreen from "@/components/loadingScreen";
import { usePet } from "@/components/petContext";
import PetAppearance from "@/components/inventory/PetAppearance";
import { PetType } from "@/types/pet";

interface HomeProps {
  activeModal: string;
  editMedicationInfo?: WithId<Medication>;
}

export default function Home({
  activeModal = "",
  editMedicationInfo = undefined,
}: HomeProps) {
  const { pet } = usePet();

  return (
    <AuthorizedRoute>
      {activeModal === "settings" && <SettingsModal />}
      {activeModal === "change-pin" && <ChangePinModal />}
      {activeModal === "add-new-medication" && <AddMedicationModal />}
      {activeModal === "edit-medication" && (
        <EditMedicationModal initialInfo={editMedicationInfo} />
      )}
      {pet ? (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
            {/* Profile */}
            <div className="flex h-52 w-fit py-8 bg-[#2c3694] justify-start items-center gap-10 mobile:px-2 tablet:px-4 desktop:px-8 largeDesktop:px-10 4xl:h-56 4xl:gap-12 4xl:px-16">
              <ProfilePicture character={pet.petType} />
              <ProfileInfo
                name={pet.name}
                level={pet.xpLevel}
                coins={pet.coins}
                currentExp={pet.xpGained}
              />
            </div>
            {/* Side Bar */}
            <div className="flex flex-col gap-9 w-fit 4xl:gap-12 justify-center pt-3 px-2 4xl:px-6">
              <NavButton buttonType="settings" drawButton={false} />
              <NavButton buttonType="help" drawButton={false} />
            </div>
          </div>
          {/* Navbar - VH Scaling */}
          <Navbar>
            <NavButton buttonType="store" />
            <NavButton buttonType="bag" />
            <NavButton buttonType="log" />
            <FeedButton />
          </Navbar>

          {/* Character, speech bubble is made relative to the image */}
          <div className="fixed mobile:left-[25%] mobile:top-[75%] tablet:left-1/2 tablet:top-[60%] transform -translate-x-1/2 -translate-y-1/2 h-[45%] max-h-[40rem] w-fit">
            <div className="relative w-full">
              <PetAppearance
                petData={pet}
                petType={pet.petType as PetType}
                selectedItem={null}
                className="short:w-[300px] minimized:w-[270px] tiny:w-[240px] largeDesktop:w-[424px] desktop:w-[360px] tablet:w-[300px]"
              />
              <div className="absolute mobile:bottom-[90%] left-[90%] tablet:bottom-[75%]">
                <Bubble />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
