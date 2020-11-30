<template>
  <base-material-card
    class="v-card--material-chart"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:heading>
      <chartist
        :data="data"
        :event-handlers="eventHandlers"
        :options="options"
        :ratio="ratio"
        :responsive-options="responsiveOptions"
        :type="type"
        style="max-height: 150px;"
      />
    </template>

    <slot
      slot="reveal-actions"
      name="reveal-actions"
    />

    <slot />

    <slot
      slot="actions"
      name="actions"
    />
  </base-material-card>
</template>

<script>
  export default {
    name: 'MaterialChartCard',

    inheritAttrs: false,

    props: {
      data: {
        type: Object,
        default: () => ({}),
      },
      eventHandlers: {
        type: Array,
        default: () => ([]),
      },
      options: {
        type: Object,
        default: () => ({}),
      },
      ratio: {
        type: String,
        default: undefined,
      },
      responsiveOptions: {
        type: Array,
        default: () => ([]),
      },
      type: {
        type: String,
        required: true,
        validator: v => ['Bar', 'Line', 'Pie'].includes(v),
      },
    },
  }
</script>

<style lang="sass">
  .v-card--material-chart
    p
      color: #999

    .v-card--material__heading
      max-height: 185px

      .ct-label
        color: inherit
        opacity: .7
        font-size: 0.975rem
        font-weight: 100

      .ct-grid
        stroke: rgba(255, 255, 255, 0.2)

      .ct-series-a .ct-point,
      .ct-series-a .ct-line,
      .ct-series-a .ct-bar,
      .ct-series-a .ct-slice-donut
          stroke: rgba(255,255,255,.8)

      .ct-series-a .ct-slice-pie,
      .ct-series-a .ct-area
          fill: rgba(255,255,255,.4)
</style>

<style lang='scss'>
  $ct-series-colors: (
          #d70206,
          #f05b4f,
          #f4c63d,
          #d17905,
          #453d3f,
          #59922b,
          #0544d3,
          #6b0392,
          #f05b4f,
          #dda458,
          #eacf7d,
          #86797d,
          #b2c326,
          #6188e2,
          #a748ca
  ) !default;

  $data-color-map: ('first-series-class': #f05b4f, 'second-series-class': #f4c63d, 'third-series': #2b922d);

  @each $cat, $color in $data-color-map {
    .#{$cat} {
      .ct-point,
      .ct-line,
      .ct-bar,
      .ct-slice-donut {
        stroke: $color
      }
      .ct-slice-pie,
      .ct-area {
        fill: $color
      }
      /* this renders as li.series-name:before */
      @at-root li#{&}:before {
        background-color: $color;
        border-color: $color;
      }
    }
  }

  .ct-legend {
    position: relative;
    z-index: 10;
    list-style: none;

    li {
      position: relative;
      margin-left: 10px;
      padding-left: 20px;
      margin-bottom: 3px;
      display: inline-block;
      cursor: pointer;
    }

    li:before {
      width: 12px;
      height: 12px;
      position: absolute;
      left: 5px;
      bottom: 5px;
      content: '';
      border-style: solid;
      border-width: 3px;
      border-radius: 2px;
    }

    li.inactive:before {
      background: transparent;
    }

    &.ct-legend-inside {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>
