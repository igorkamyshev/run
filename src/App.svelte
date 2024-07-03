<script>
  import { Input, Label, Heading } from "flowbite-svelte";

  import {
    minutesOnKilometerView$,
    kilometersPerHourView$,
    onChangeKilometersPerHour,
    onChangeMinutesOnKilometer,
  } from "./view-model";
</script>

<main class="container mx-auto max-w-screen-sm">
  <Heading class="mb-10">Run</Heading>

  <div class="grid gap-6 md:grid-cols-2 mb-10">
    <div>
      <Label for="minutesOnKilometer" class="mb-2 text-lg"
        >Минут на километр</Label
      >
      <Input
        class="text-lg"
        type="number"
        id="minutesOnKilometer"
        value={$minutesOnKilometerView$}
        on:input={onChangeMinutesOnKilometer}
      />
    </div>
    <div>
      <Label for="kilometersPerHour" class="mb-2 text-lg"
        >Километров в час</Label
      >
      <Input
        class="text-lg"
        type="number"
        id="kilometersPerHour"
        value={$kilometersPerHourView$}
        on:input={onChangeKilometersPerHour}
      />
    </div>
  </div>
</main>
