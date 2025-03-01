import React from "react";
import Image from "next/image";

const WorkflowAnimation = () => (
  <div className="flex max-w-[100px] flex-col gap-3 text-center">
    <div className="relative h-[100px] w-[100px] overflow-hidden rounded-lg p-1">
      <div className="animate-rotate absolute left-1/2 z-0 h-[100px] w-[100px] rounded-[30px] bg-gradient-to-r from-pink-500/20 via-blue-500/20 to-purple-500/20" />
    </div>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="flex h-full items-center justify-center bg-white">
      <div className="mx-auto">
        <div className="relative">
          {/* Line going through */}
          <div className="absolute left-16 right-16 top-2 hidden md:block">
            <div className="relative h-10">
              <Image
                className="w-full"
                fill
                src={"/curved-dotted-line.svg"}
                alt=""
              />
            </div>
          </div>

          <div className="relative grid grid-cols-1 gap-x-12 gap-y-12 text-center md:grid-cols-3">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white">
                <span className="text-xl font-semibold text-gray-700">🤖</span>
              </div>
              <h3 className="mt-5 text-sm font-semibold tracking-tight text-black">
                Create a free account
              </h3>
            </div>

            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
                <WorkflowAnimation />
              </div>
              <h3 className="mt-5 text-sm font-semibold tracking-tight text-black">
                Build your flow
              </h3>
            </div>

            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white">
                <span className="text-xl font-semibold text-gray-700">🦾</span>
              </div>
              <h3 className="mt-5 text-sm font-semibold tracking-tight text-black">
                Release & Launch
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

// const BotInput = () => (
//   <>
//     <div className="flex flex-col items-center gap-5 self-start text-center text-xs font-semibold tracking-tighter">
//       <span className="text-[50px]">🤖</span>
//       Telegram
//       <br />
//       or
//       <br />
//       API input
//       <div className="h-10 w-1 bg-black/25" />
//     </div>
//   </>
// );

// const Output = () => (
//   <>
//     <div className="self-end">
//       <span className="text-[50px]">O</span> for output
//     </div>
//   </>
// );

// const FlowAnimation: React.FC = () => {
//   return (
//     <div className="relative flex h-96 w-full items-center justify-between gap-3">
//       <BotInput />
//       <WorkflowAnimation />
//       <Output />
//     </div>
//   );
// };

// export default FlowAnimation;
