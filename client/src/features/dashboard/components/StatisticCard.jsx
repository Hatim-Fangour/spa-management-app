import React from "react";
import { IoTrendingUpOutline, IoTrendingDownOutline } from "react-icons/io5";
let formatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}); 
const StatisticCard = ({card}) => {
  return (
    <div
      className={`box-1 box h-[100%] w-full p-[10px] rounded-lg flex flex-col text-white shadow-[0_0_6px_0_rgba(0,0,0,0.75)] bg-gradient-to-br ${card.style}`}
    >
      <div className="box-content w-full h-full flex flex-col items-center justify-between">
        <div className="topBox items-center justify-between flex w-full">
          <h4 className="box-title w-[50%] m-0">{card.title}</h4>
          <span className="text-[40px] mr-[5px]">{card.icon}</span>
        </div>

        <div className="bottomBox w-full items-start justify-between flex flex-col">
          <span className="ttlValue text-[30px] font-bold text-ellipsis overflow-hidden w-full">
            {formatter.format(card.total)}
            <span className="text-[15px]">$</span>
          </span>

          <div className={`flex items-center gap-[10px] py-[2px] px-[5px] rounded-[15px] font-bold compare pos 
          ${((card.comparison >= 0 && !card.type ==="expense") || (Number(card.comparison) >= 0 && card.type ==="income")) ? 
            `text-[rgb(113,255,113)] bg-[rgba(0,255,0,0.075)] border-[1px] border-[rgba(113,255,113,0.78)]` : 
            `text-[rgb(95,25,25)] bg-[rgba(255,103,103,0.18)] border-[1px] border-[rgba(170,26,26,0.61)]
            `}
`}>
            {((Number(card.comparison) >= 0 && card.type ==="expense") || (Number(card.comparison) >= 0 && card.type ==="income")) ? (
              <IoTrendingUpOutline className="text-[20px] cmprIcon pos " />
            ) : (
              <IoTrendingDownOutline className="text-[20px] cmprIcon nega" />
            )}

            <span className="text-[12px] cmprValue">{card.comparison} %</span>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
