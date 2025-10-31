import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleBackIcon = () => {
    window.location.href = "/";
  };

  const helpSections = [
    {
      title: "Medications",
      content:
        "Parents, and youth members if parental controls are disabled, can add new medications to the medication regimen by providing an medication form, medication abbreviation, frequency, dose per day, times of doses, etc. They can also edit or delete existing medications on the medications page. Parents and youth members can view Yesterday’s and Tomorrow’s doses in the medication log. They can click check-in on a medication dose and enter a pin to confirm that their child has taken that dose.",
    },
    {
      title: "Log",
      content:
        "After receiving a text notification to take their medication, users can click the “Log” button on the home page to view their medication. Users can then “Take” the medication within a 30 minute window (15 minutes before the scheduled dose to 15 minutes after the scheduled dose). If parental controls are enabled, the parent must enter their pin to verify that the child has taken their medication. If parental controls are disabled, the child can simply click “Take” to mark the dose as taken. Users earn a food reward for taking a medication on time. The modal then navigates the user to the home page and a FEED button appears so the user can feed their pet. Missed Doses: If a dose is not marked “Taken” within the 30 minute time window, the dose is marked as a “Missed Dose”. The user is not able to override or log that medication, regardless if the user actually took the medication or not. This places more responsibility on the user, since the non profit told us not to handle missed doses, late doses, or double doses. Log Page: Users are able to view their previous and upcoming doses for the day, as well as yesterday’s doses and tomorrow’s doses.",
    },
    {
      title: "Parental Controls",
      content:
        "Parent can toggle parental control, change pin, and change frequency of medication check-in. Check-in is per dose or per day. Parent can toggle on parental control to set up a 4-digit alphanumeric pin which restricts child access to the medication settings page and medication check-in form. Any time the parent is prompted for a pin, parent can click ‘forgot pin’ to enter the 8-character account password and set a new pin number. If parental control is toggled on after being off, the parent will be prompted to create a new pin. Turning Off Parental Settings for Older Children Parents may deem a child old enough or responsible enough to manage medication regimen and/or check-ins. If a parent turns off parental control, the pin number will be deleted and a user will not need to enter the pin to access medication check-ins or medication regimen settings.",
    },
    {
      title: "Coins & XP",
      content:
        "Experience points, called “XP”, is gained every time the user feeds the pet. Gaining XP allows the user to level up. Leveling up gives the user coins and access to more items in the store. Items purchased in the store are moved to the bag.",
    },
    {
      title: "Feeding",
      content:
        "Each time a user marks a dose as “Taken”, the user earns a food reward. Upon earning a food reward, the user can click on the FEED button on the Home page to select a food item to feed their pet.  After the child clicks the FEED button and selects a food item to feed their pet. The child can drag and drop the food item onto the pet to feed their pet. If a pet is not fed within 15 minutes before to 15 minutes after the scheduled dose, the pet will appear sad, visually indicating a missed dose, and a text bubble next to the pet will advise the user to take their medication on time. After the user feeds their pet 1 food item, the pet’s XP bar increases.",
    },
    {
      title: "FAQ",
      content: "This will be completed after user-testing.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-icanBlue-200 p-8 font-quantico">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button>
            <Image
              src={"/assets/LeftArrowIcon.svg"}
              alt=""
              width={60}
              height={60}
              onClick={handleBackIcon}
            />
          </button>
          <h1 className="text-white text-6xl font-bold">Help</h1>
        </div>

        <div className="bg-[#c5cde8] border-8 border-[#7177AC] rounded-none overflow-hidden">
          {helpSections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col w-full border-b-4 border-[#7177AC]"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between px-2 py-2 text-left bg-[#c5cde8] transition-colors"
              >
                <span className="text-[#2d3461] text-3xl font-bold">
                  {section.title}
                </span>
                <div className="flex-shrink-0 w-10 h-10 bg-[#2d3461] rounded flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="text-white w-6 h-6" />
                  ) : (
                    <Plus className="text-white w-6 h-6" />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 py-6 text-black text-2xl font-bold">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
