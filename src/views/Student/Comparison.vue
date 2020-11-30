<template>
  <v-container>
<!--    <v-row>-->
<!--      <v-col>-->
<!--        <base-material-chart-card-->
<!--                :data="data"-->
<!--                :options="chartOptions"-->
<!--                color="cyan"-->
<!--                type="Line"-->
<!--        >-->
<!--          <h4 class="card-title font-weight-light mt-2 ml-2">-->
<!--            GPAs of Students-->
<!--          </h4>-->
<!--        </base-material-chart-card>-->
<!--      </v-col>-->
<!--    </v-row>-->
    <chartist :data="data" type="Line" :options="chartOptions" ></chartist>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    data () {
      return {
        students: [],
        chartOptions: {
          high: 4.0,
          lineSmooth: this.$chartist.Interpolation.simple({
            fillHoles: true
          }),
          plugins: [
            this.$chartist.plugins.tooltip(),
            this.$chartist.plugins.legend({
              legendNames: ['Blue pill', 'Red pill', 'Purple pill'],
            }),
            this.$chartist.plugins.ctAxisTitle({
              axisY: {
                axisTitle: 'GPA',
                axisClass: 'ct-axis-title',
                offset: {
                  x: 0,
                  y: 0
                },
                textAnchor: 'middle',
                flipTitle: false
              }
            })
          ]
        }
      }
    },

    methods: {
      getStudents(){
        let _this = this;
        _this.students = [
          {name: "Tommy Abraham", major: 'Physics', year: '2021', credits: 230,
            gpa: [3.9, null, 3.8,2.0,1.9,4.0,2.5]},
          {name: "Tammy Mount", major: 'Physics', year: '2021', credits: 48,
            gpa: [3.8,2.0,1.9,4.0,2.5, null, null, 2.0, 3.5]},
          {name: "Tommy Rashford", major: 'Chemistry', year: '2028', credits: 180,
            gpa: [3.8,2.0,4.0,2.5, 2.5, 3.8,2.0,4.0,2.5, 2.5]},
          {name: "To Abham", major: 'Physics', year: '2051', credits: 240,
            gpa:[3.8,4.0,2.5, 3.8,2.0,4.0,2.5, 2.5]},
          {name: "Sy Abraam", major: 'CAS', year: '2031', credits: 200,
            gpa:[2.5, null, 3.8,2.0,null, 1.9,4.0, null, null, 2.5]},
        ];
      }
    },
    computed: {
      data(){
        let labels = ["Fall 2018", "Spring 2018",
          "Fall 2019", "Spring 2019",
          "Fall 2020", "Spring 2020",
          "Fall 2021", "Spring 2021",
          "Fall 2022", "Spring 2022"];
        let series = [];
        this.students.forEach(x=> series.push(x.gpa));
        return {series: series, labels: labels}
      },
      names(){
        return this.students.map(x=>x.name)
      }
    },
    created() {
      this.getStudents();
    }
  }
</script>
