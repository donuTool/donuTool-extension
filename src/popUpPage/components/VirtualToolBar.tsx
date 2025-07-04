import donuToolBar from "@/assets/donuToolBar.png";

export default function VirtualToolBar() {
  return (
    <div className="relative">
      <img src={donuToolBar} className="w-[150px] h-[150px] brightness-[1.15]" />
      <div className="absolute top-[15px] left-[93.3px] flex w-[33.3px] h-[33.3px] rounded-full justify-center items-center bg-neutral-300"></div>
      <div className="absolute top-[53.3px] left-[109.2px] flex w-[33.3px] h-[33.3px] rounded-full justify-center items-center bg-neutral-300"></div>
      <div className="absolute top-[93.3px] left-[93.3px] flex w-[33.3px] h-[33.3px] rounded-full justify-center items-center bg-neutral-300"></div>
      <div className="absolute top-[109.2px] left-[53.3px] flex w-[33.3px] h-[33.3px] rounded-full justify-center items-center bg-neutral-300"></div>
      <div className="absolute top-[92.5px] left-[15.8px] flex w-[33.3px] h-[33.3px] rounded-full justify-center items-center bg-neutral-300"></div>
    </div>
  );
}
