 <div className="newIncomeModal absolute inset-0 bg-gray-100 w-[550px] h-[600px] rounded-xl p-3 px-[15px] m-auto" ref={ref}>
      <div className="incomeContainer flex h-full flex-col">
        <header className="flex items-center justify-between mb-4 p-2">
          <div className="winTitle font-semibold ml-5 text-[25px]">Add Income</div>
          <span className="closeIconContainer cursor-pointer flex items-center justify-center h-7 w-7 rounded-lg text-[20px] text-[#797979]">
            <Close className="closeIcon text-[18px] hover:bg-[#c7c7c7]" onClick={props.handleClose} />
          </span>
        </header>

        <main className="flex items-center justify-between  h-full w-full">
          <div className="modal-container h-full w-full flex items-center justify-between flex-col">
            <form className="details w-full h-full flex flex-col items-center justify-between">
              <div className="grouper flex items-center w-full gap-6">
                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <DateRange className="entryIcon" />
                  </span>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: { variant: "outlined" },
                      }}
                      value={props.data.date}
                      defaultValue={dayjs()}
                      onChange={handleDateChange}
                    />
                  </LocalizationProvider>
                </div>
                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <AttachMoney className="entryIcon" />
                  </span>
                  <TextField
                    id="filled-basic"
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">$</InputAdornment>
                        ),
                      },
                    }}
                    // error = {true}
                    error={!!props.errors?.amount}
                    sx={{ minWidth: 120, width: "100%" }}
                    label="Amount"
                    variant="outlined"
                    name="amount"
                    value={props.data.amount}
                    onChange={handleIncomeDataChange}
                  />
                </div>
              </div>

              <div className="grouper flex items-center w-full gap-6">
                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <Category className="entryIcon" />
                  </span>

                  <Box sx={{ minWidth: 120, width: "100%" }}>
                    <FormControl
                      required
                      variant="outlined"
                      fullWidth
                      error={!!props.errors?.category}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Category
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={props.data.category}
                        label="Category"
                        name="category"
                        onChange={(e) => {
                          handleIncomeDataChange(e);
                        }}
                        sx={{
                          width: "100%", // Fixed width
                          maxWidth: "220px", // Prevents it from growing
                          display: "flex", // Ensures proper text rendering
                          whiteSpace: "nowrap", // Prevents text from wrapping
                          overflow: "hidden", // Hides overflowed text
                          textOverflow: "ellipsis", // Shows "..." when text is long
                        }}
                      >
                        {IncomeCategoryMenuItems.map((item) => (
                          <MenuItem
                            key={item.value}
                            value={item.value}
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>

                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <LightbulbOutlined className="entryIcon" />
                  </span>
                  {/* <input type="text" autoFocus placeholder="Description" /> */}
                  <TextField
                    id="filled-basic"
                    sx={{ minWidth: 120, width: "100%" }}
                    label="Description"
                    name="description"
                    value={props.data.description}
                    variant="outlined"
                    onChange={handleIncomeDataChange}
                  />
                </div>
              </div>

              <div className="grouper flex items-center w-full gap-6">
                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <CreditCardOutlined className="entryIcon" />
                  </span>

                  <Box sx={{ minWidth: 120, width: "100%" }}>
                    <FormControl
                      required
                      variant="outlined"
                      fullWidth
                      error={!!props.errors?.payMethode}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Payment Method
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={props.data.payMethode}
                        name="payMethode"
                        label="Payment Method"
                        onChange={(e) => {
                          // setSelectedPaymentMethod(e.target.value);
                          handleIncomeDataChange(e);
                        }}
                        sx={{
                          width: "100%", // Fixed width
                          maxWidth: "220px", // Prevents it from growing
                          display: "flex", // Ensures proper text rendering
                          whiteSpace: "nowrap", // Prevents text from wrapping
                          overflow: "hidden", // Hides overflowed text
                          textOverflow: "ellipsis", // Shows "..." when text is long
                        }}
                      >
                        {PayementMethodMenuItems.map((item) => (
                          <MenuItem
                            key={item.value}
                            value={item.value}
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>

                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <HowToRegOutlined className="entryIcon" />
                  </span>
                  <TextField
                    id="filled-basic"
                    sx={{ minWidth: 120, width: "100%" }}
                    label="Client Name"
                    name="clientName"
                    variant="outlined"
                    value={props.data.vendorSupplier}
                    onChange={handleIncomeDataChange}
                  />
                </div>
              </div>

              <div className="grouper flex items-center w-full gap-6">
                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <SensorOccupiedOutlined className="entryIcon" />
                  </span>

                  <Box
                    sx={{ minWidth: 120, width: "100%", maxWidth: "262.5px" }}
                  >
                    <FormControl
                      required
                      variant="outlined"
                      error={!!props.errors?.employeeInvolved}
                      fullWidth
                    >
                      <InputLabel id="demo-simple-select-label">
                        Employee Involved
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        value={props.data.employeeInvolved}
                        id="demo-simple-select"
                        label="EmployeeInvolved"
                        name="employeeInvolved"
                        onChange={(e) => {
                          // setSelectedDepServ(e.target.value);
                          handleIncomeDataChange(e);
                        }}
                        sx={{
                          width: "100%", // Fixed width
                          maxWidth: "220px", // Prevents it from growing
                          display: "flex", // Ensures proper text rendering
                          whiteSpace: "nowrap", // Prevents text from wrapping
                          overflow: "hidden", // Hides overflowed text
                          textOverflow: "ellipsis", // Shows "..." when text is long
                        }}
                      >
                        {IncomeEmployeeInvolvedItems.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>

                <div className="entry h-full w-[250px] max-w-[250px] flex items-center gap-4">
                  <span>
                    <RequestQuoteOutlined className="entryIcon" />
                  </span>
                  <Box sx={{ minWidth: 120, width: "100%" }}>
                    <FormControl
                      required
                      variant="outlined"
                      error={!!props.errors?.status}
                      fullWidth
                    >
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status"
                        value={props.data.status}
                        name="status"
                        onChange={(e) => {
                          // setSelectedStatus(e.target.value);
                          handleIncomeDataChange(e);
                        }}
                      >
                        {StatusMenuItems.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>

              <div className="grouper flex items-center w-full gap-6 notes">
                <span>
                  <EditNoteOutlined className="entryIcon" />
                </span>
                <TextField
                  id="filled-multiline-flexible"
                  label="Notes"
                  name="notes"
                  sx={{ minWidth: 120, width: "100%" }}
                  multiline
                  maxRows={2}
                  variant="outlined"
                  onChange={handleIncomeDataChange}
                  value={props.data.notes}
                />
              </div>

              <footer className="w-full mb-2 flex items-center justify-end pr-5">
                <button onClick={props.handleClose} className="bg-transparent cursor-pointer font-bold text-[#414141] py-2 px-5 rounded-2xl">Cancel</button>
                <button onClick={props.handleSubmit} className="saveBtn bg-transparent cursor-pointer font-bold text-[#414141] py-2 px-5 rounded-3xl  border-[1px] border-black">
                  Save
                </button>
              </footer>
            </form>
          </div>
        </main>
      </div>
    </div>