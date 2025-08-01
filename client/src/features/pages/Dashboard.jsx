import StatisticCard from "../dashboard/components/StatisticCard";
import {  IoTrendingDownOutline, IoTrendingUpOutline } from "react-icons/io5";
import { SavingsOutlined } from "@mui/icons-material";
import InOutTable from "../dashboard/components/InOutTable";
import SavingsTable from "../dashboard/components/SavingsTable";
import { useEffect, useState } from "react";
import { initExpense, initIncome, initSaving } from "../../app/config";
import { Backdrop, Box, Modal } from "@mui/material";
import AddExpenseModal from "../dashboard/components/AddExpenseModal";
import AddIncomeModal from "../dashboard/components/AddIncomeModal";
import AddSavingModal from "../dashboard/components/AddSavingModal";
import { useDispatch, useSelector } from "react-redux";
import { setupAllListeners } from "../dashboard/slices/dashSlice";
import DeleteConfirmDialog from "../communComponents/DeleteConfirmDialog";
import { Toaster } from "react-hot-toast";
import {
  addExpense,
  addIncome,
  addSaving,
  deleteExpense,
  deleteIncome,
  deleteSaving,
  updateExpense,
  updateIncome,
  updateSaving,
} from "../dashboard/thunks/dashboardThunks";
import { notifySuccess } from "../utils/toastNotify";
import { backdropStyle } from "../utils/styles";
import { abrv, cardsInfo } from "../dashboard/utils/dashUtils";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openSavingModal, setOpenSavingModal] = useState(false);
  const [errors, setErrors] = useState({
    expense: {},
    income: {},
    saving: {},
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [expenseData, setExpenseData] = useState(initExpense);
  const [incomeData, setIncomeData] = useState(initIncome);
  const [savingData, setSavingData] = useState(initSaving);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const comparisonData = useSelector((state) => state.dashboard.followUp);
  const todaysTotals = useSelector((state) => state.dashboard.statistics);

  useEffect(() => {
    const unsubscribe = dispatch(setupAllListeners());
    return () => unsubscribe();
  }, [dispatch]);

  const handleOpenExpenseModal = () => {
    setIsEditMode(false);

    setErrors({});
    setExpenseData(initExpense);
    setOpenExpenseModal(!openExpenseModal);
  };

  const handleOpenIncomeModal = () => {
    setIsEditMode(false);
    setErrors({});
    setIncomeData(initIncome);
    setOpenIncomeModal(!openIncomeModal);
  };

  const handleOpenSavingModal = () => {
    setIsEditMode(false);
    setErrors({});
    setSavingData(initSaving);
    setOpenSavingModal(!openSavingModal);
  };

  const handleSubmitIncome = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      try {

        await dispatch(updateIncome(incomeData)).unwrap();
        notifySuccess("Income", "updated");
      } catch (error) {
        setErrors(error);
      }
    } else {
      try {
        await dispatch(addIncome(incomeData)).unwrap();
        notifySuccess("Income", "added");
        setIncomeData(initIncome);
        handleOpenIncomeModal();
      } catch (error) {
        setErrors(error);
      }
    }

  };

  const handleSubmitExpenses = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      try {
        // setExpenseData(initExpense);
        await dispatch(updateExpense(expenseData)).unwrap();
        notifySuccess("Expense", "updated");
      } catch (error) {
        setErrors(error);
      }
    } else {
      try {
        await dispatch(addExpense(expenseData)).unwrap();
        notifySuccess("Expense", "added");
        // notify()
        setExpenseData(initExpense);
        handleOpenExpenseModal();
      } catch (error) {
        setErrors(error);
      }
    }

  };

  const handleSubmitSaving = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      try {
        // setExpenseData(initExpense);
        await dispatch(updateSaving(savingData)).unwrap();
        notifySuccess("Saving", "updated");
     
      } catch (error) {
        if (error.payload?.type === "validation") {
          setErrors(error.payload.errors);
        } else {
          
          // General server error
          // notifyError(error.payload?.message || "Failed to add expense");
        }
      }
    } else {
      try {
        
        const res = await dispatch(addSaving(savingData)).unwrap();
        notifySuccess("Saving", "added");
        setSavingData(initSaving);
        handleOpenSavingModal();
      } catch (error) {
        
        setErrors(error);
      }
    }
  };

  const handleCancelDelete = () => {
    
    setDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    try {
      if (expenseData?.id) {
        dispatch(deleteExpense(expenseData.id));
      } else if (incomeData?.id) {
        dispatch(deleteIncome(incomeData.id));
      } else if (savingData?.id) {
        dispatch(deleteSaving(savingData.id));
      }
    } catch (error) {
    }
    setDeleteDialogOpen(false);
  };

    const updatedCardsInfo = cardsInfo.map((card) => {
    // Find the matching element in abrv (remove this if not needed)
    if (abrv.includes(card.acro)) {
      // Get the comparison key by replacing "T" with "P"
      const comparisonKey = card.acro.replace("T", "P");

      return {
        ...card,
        total: todaysTotals[card.acro],
        comparison: comparisonData[comparisonKey],
      };
    }
    return card; // Return unchanged if no match
  });


  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <Box
        sx={{
          minHeight: "100vh",
          // bgcolor: "#f8fffe",
          overflow: "auto",
          backdropFilter: "blur(15px)",
          p: { xs: 2, md: 3, lg: 4 },
        }}
      >
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={handleCancelDelete}
          onConfirm={confirmDelete}
          title={`Delete ${expenseData?.type || incomeData?.type || savingData?.type} `}
          description="Are you sure you want to delete this item ?"
        />



        <div className="w-full h-[100%] flex items-center flex-col dashboardContainer">
          <div className="h-[60px] text-[30px] pt-[10px] text-[#cab06d]  font-bold tracking-[10px] transition-all duration-500 ease-in-out hover:tracking-[20px] header">
            Dashboard
          </div>

          <div className="dashboard p-[10px] w-full h-[calc(100%-60px)]">
            <div
              className="dashboardBody grid 
            grid-cols-[70%_29%] 
            auto-rows-[25%_75%]
            w-full h-[98%] gap-5 box-border"
            >
              <div className=" item-1 item pb-[10px] px-0 rounded-[10px] box-border flex items-start justify-start p-0 gap-[10px] border-none">
                {updatedCardsInfo.map((card, index) => (
                  <StatisticCard
                    key={index}
                    card={card}
                   
                  />
                ))}
              </div>

              <div
                className="item-2 h-[100%]  item col-start-1 row-start-2 p-0 overflow-hidden shadow-[0px_0px_5px_-2px_rgba(0,0,0,0.75)] 
                px-0 rounded-[10px]"
              >
                <div className="item-header  box-border h-[15%] flex items-center justify-between  px-[20px]">
                  <div className="item-title text-[20px] font-bold ">
                    In/Out
                  </div>

                  <div className="btnContainer relative">
                    <div className="btns flex items-center justify-between gap-[10px]">
                      <button
                        className="addBtn Saving flex items-center justify-between gap-[10px] w-[160px] 
                        hover:border-[1px] hover:border-green-600 hover:text-green-600
                          py-[10px] px-[20px] rounded-[30px] text-[16px] font-bold text-gray-600"
                        onClick={handleOpenIncomeModal}
                      >
                        <span className="addText text-[15px] font-bold border-b-2 ">
                          Add Income
                        </span>
                        <IoTrendingUpOutline className="icon text-[20px] font-bold" />
                      </button>

                      <button
                        className="addBtn expense flex items-center justify-between gap-[10px] w-[160px]  hover:border-[1px] hover:border-red-600 hover:text-red-600
                          py-[10px] px-[20px] rounded-[30px] text-[16px] font-bold text-gray-600 "
                        onClick={handleOpenExpenseModal}
                      >
                        <span className="addText text-[15px] font-bold border-b-2 ">
                          Add Expense
                        </span>
                        <IoTrendingDownOutline className="icon text-[20px] font-bold" />
                      </button>
                    </div>

                    {openExpenseModal && (
                      <Modal
                        open={openExpenseModal}
                        // onClose={(event, reason) => {
                        //   if (reason !== "backdropClick") {
                        //     handleOpenExpenseModal();
                        //   }
                        // }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        // className="absolute inset-0 bg-black/30 w-[550px] h-[600px] rounded-xl p-3 px-[15px] mx-auto my-auto"

                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            style: { ...backdropStyle, zIndex: 200 }, // zIndex matches default MUI modal
                          },
                        }}
                      >
                        <div tabIndex={0}>
                          <AddExpenseModal
                            data={expenseData}
                            errors={errors}
                            setErrors={setErrors}
                            setData={setExpenseData}
                            handleClose={handleOpenExpenseModal}
                            handleSubmit={handleSubmitExpenses}
                            isEditMode={isEditMode}
                          />
                        </div>
                      </Modal>
                    )}

                    {openIncomeModal && (
                      <Modal
                        open={openIncomeModal}
                        onClose={(event, reason) => {
                          if (reason !== "backdropClick") {
                            handleOpenIncomeModal();
                          }
                        }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            style: backdropStyle,
                          },
                        }}
                      >
                        <div tabIndex={0}>
                          <AddIncomeModal
                            data={incomeData}
                            setData={setIncomeData}
                            errors={errors}
                            setErrors={setErrors}
                            handleSubmit={handleSubmitIncome}
                            handleClose={handleOpenIncomeModal}
                            isEditMode={isEditMode}
                          />
                        </div>
                      </Modal>
                    )}
                  </div>
                </div>

                <div className="itemContent h-[85%] ">
                  <InOutTable
                    setOpenExpenseModal={setOpenExpenseModal}
                    setOpenIncomeModal={setOpenIncomeModal}
                    setIsEditMode={setIsEditMode}
                    setExpenseData={setExpenseData}
                    setIncomeData={setIncomeData}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                  />
                </div>
              </div>

              <div
                className="item-3 h-[100%] item col-start-2 row-span-2 p-0 overflow-hidden shadow-[0px_0px_5px_-2px_rgba(0,0,0,0.75)] 
                px-0 rounded-[10px]"
              >
                <div className="item-header  box-border h-[10%] flex items-center justify-between  px-[15px]">
                  <div className="item-title text-[20px] font-bold">
                    Savings
                  </div>
                  <div>
                    <button
                      className="flex items-center justify-between gap-[10px] w-[160px] 
                        hover:border-[1px] hover:border-green-600 hover:text-green-600
                          py-[10px] px-[20px] rounded-[30px] text-[16px] font-bold text-gray-600 "
                      onClick={handleOpenSavingModal}
                    >
                      <span className="addText">Add Saving</span>
                      <SavingsOutlined className="addIcon" />
                    </button>

                    <Modal
                      open={openSavingModal}
                      onClose={(event, reason) => {
                        if (reason !== "backdropClick") {
                          handleOpenSavingModal();
                        }
                      }}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          style: backdropStyle,
                        },
                      }}
                    >
                      <div tabIndex={0}>
                        <AddSavingModal
                          data={savingData}
                          setData={setSavingData}
                          setErrors={setErrors}
                          handleSubmit={handleSubmitSaving}
                          handleClose={handleOpenSavingModal}
                          isEditMode={isEditMode}
                          errors={errors}
                        />
                      </div>
                    </Modal>
                  </div>
                </div>

                <div className="itemContent h-[90%]">
                  <div className="tableDetails h-full">
                    <SavingsTable
                      setOpenSavingModal={setOpenSavingModal}
                      setIsEditMode={setIsEditMode}
                      setSavingData={setSavingData}
                      setDeleteDialogOpen={setDeleteDialogOpen}
                    />
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Dashboard;
