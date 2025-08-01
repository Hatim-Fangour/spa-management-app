import {  Grid, Skeleton, Stack } from "@mui/material";

const LoadingSkeleton = () => {
  return (
   <Grid
        container
        sx={{
          width: "100%",
          height: "100vh",
          padding: 6,
        }}
        spacing={2}
      >
        {/* Left Column - 70% */}
        <Grid item size={9} xs={12} md={8.4} sx={{ height: "100%" }}>
          <Grid
            container
            direction="column"
            sx={{
              height: "100%",
            }}
            spacing={0} // 🔒 Important: no spacing to preserve exact height %
          >
            <Stack
              spacing={2}
              sx={{
                height: "100%",
              }}
            >
              <Skeleton variant="rounded" width="100%" height="40%" />
              <Skeleton variant="rounded" width="100%" height="60%" />
            </Stack>
            {/* <Grid
              item
              sx={{ flexBasis: "40%", flexGrow: 0, flexShrink: 0, gap: "2px" }}
            ></Grid>
            <Grid
              item
              sx={{ flexBasis: "60%", flexGrow: 0, flexShrink: 0 }}
            ></Grid> */}
          </Grid>
        </Grid>

        {/* Right Column - 30% */}
        <Grid item size={3} xs={12} md={3.6} sx={{ height: "100%" }}>
          <Skeleton variant="rounded" width="100%" height="100%" />
        </Grid>
      </Grid>
  );
};

export default LoadingSkeleton;
