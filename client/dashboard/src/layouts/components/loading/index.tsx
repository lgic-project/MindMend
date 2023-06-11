
import { Grid, Loading as NextUILoading } from "@nextui-org/react";

export default function NextUILoadingComponent() {
    return (
      <Grid.Container gap={4} justify="center" >
      <Grid>
          <NextUILoading type="spinner" size="lg" />
          </Grid>
          </Grid.Container>

    )}
