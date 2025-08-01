import { InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { getDaysRemaining, getEventColor } from "../utils/calendarUtils";

const TodayEventCard = ({ todayEventData }) => {


  return (
    <div
      className={`relative h-[70px] mt-2 overflow-hidden todayEventsCard flex w-full box-border p-2.5 pl-5 gap-2 rounded-xl items-start justify-between bg-[#ffe49f4f] border-[1px]
         border-[${getEventColor(todayEventData.type)}] 
      after:content-[''] after:left-0 after:top-0 after:absolute after:w-2 after:h-full
      after:bg-[${getEventColor(todayEventData.type)}]
      `}
      style={{
        borderColor: getEventColor(todayEventData?.type),
        "--after-bg-color": getEventColor(todayEventData?.type),
      }}
    >
      <div className="info flex items-center gap-2.5  w-[90%]">
        {/* <img
          className="w-[50px] h-[50px] rounded-full object-cover border-[0.5px] border-gray-400/20"
          src="https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        /> */}
        <div className="details w-full">
          <div className="date">
            {todayEventData.type === "Reminder"
              ? `at ${todayEventData?.interval?.start?.time}`
              : todayEventData.type === "Time Off"
              ? `${getDaysRemaining(
                  todayEventData?.interval?.end?.date
                )} days left`
              : `${todayEventData?.interval?.start?.time} - ${todayEventData?.interval?.end?.time}`}
          </div>
          <div className="name font-bold text-gray-900/90 capitalize text-nowrap text-ellipsis w-[100%] overflow-hidden">
            {
              todayEventData.type === "Reminder"
                ? "Reminder"
                : todayEventData.type === "Time Off"
                ? `${todayEventData?.title}`
                : todayEventData?.title
              // todayEventData?.concerned?.fullName
            }
          </div>
        </div>
      </div>

      <span className="moreDetailsIconContainer flex items-center cursor-pointer">
        <Tooltip title={todayEventData.type ==="Reminder" ?`for ${todayEventData.concerned.fullName}` :`for ${todayEventData.title}`} placement="right" arrow>
          <InfoOutlined className="moreDetailsIcon text-[#cab06d] text-[17px]" />
        </Tooltip>
      </span>
    </div>
  );
};

export default TodayEventCard;
