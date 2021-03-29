<template>
  <v-container>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <span class="text-h4">
            Students
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col
                cols="6"
                v-for="(student, index) in students" :key="index"
            >
              <base-material-card
                  color="info"
                  icon="mdi-account-details"
                  title="Student information"
              >
                <v-card-text>
                  <div class="display-2 font-weight-light">
                    {{student.name}}
                  </div>
                  <div class="display-2 font-weight-light">
                    {{student.id}}
                  </div>
                  <div class="text--primary font-weight-light">
                    {{student.major}}
                  </div>
                  <div class="text--primary font-weight-light">
                    Admission semester: {{student.admissionSemester}}
                  </div>
                  <div class="text--primary">
                    <span class="font-weight-light">cGPA:</span> {{student.gpa}}
                  </div>
                  <div class="text--primary">
                    <span class="font-weight-light">Credits earned:</span> {{student.creditsEarned}}
                  </div>
                </v-card-text>
              </base-material-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header><span class="text-h4">Comparison</span></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <base-material-chart-card
                  elevation="0"
                  :data="data"
                  :options="chartOptions"
                  color="success"
                  type="Line"
              >
                <h4 class="card-title font-weight-light mt-2 ml-2">
                  Comparison
                </h4>
              </base-material-chart-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
  import {get} from "../../helpers/api";

  export default {
    props: ['id'],
    data () {
      return {
          data: {
              labels: ['Fall 2017', 'Spring 2018', 'Fall 2018', 'Spring 2019', 'Fall 2019', 'Spring 2020', 'Fall 2020',
                  'Spring 2021', 'Fall 2021'],
              series: [
                  [3.3, 3.6, null, 3.7, null, 2.8, 2.5, 3.23, 3.6],
                  [3.2, 3.1, null, 3.5, 2.7, 3.3, 3.1, 3.3, 2.04],
                  [3.1, 3.3, 2.04, 2.5, 3.6, 3.1, 3.3, 2.04, 2.99]]
          },
          students: [],
          panel: [0, 1],
          chartOptions: {
              high: 4,
              low: 0,
              lineSmooth: this.$chartist.Interpolation.none({
                fillHoles: false
              }),
              plugins: [
                  this.$chartist.plugins.tooltip({ anchorToPoint: true }),
                  this.$chartist.plugins.ctAxisTitle({
                      axisY: {
                          axisTitle: 'GPA',
                          axisClass: 'gpa-axis-title',
                          textAnchor: 'middle',
                          offset: {
                              x: 0,
                              y: 20
                          },
                          flipTitle: true
                      }
                  }),
                  // this.$chartist.plugins.legend({legendNames: ["Hey", "Pay"]})
              ]
            }
          }
    },

    methods: {
      getStudents(){
          let _this = this;
          get(_this, '/transcript/students/'+_this.id, {}, response=>{
              _this.students = response.data;
              // _this.getGraph();
          });
      },
      getGraph(){
        let _this = this;
        get(_this, '/transcript/studentsGraph/'+_this.id, {}, response=>{
          _this.data = response.data;
        });
      }
    },
    computed: {
      chartData(){
          return {
              labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              series: [
              [12, 9, 7, 8, 5],
              [2, 1, 3.5, 7, 3],
              [1, 3, 4, 5, 6]
          ]
          }
      },
    },
    created() {
      this.getStudents();
      this.getGraph();
    }
  }
</script>

<style>
    .chartist-tooltip
    {
        background: #999999;
    }

    .chartist-tooltip:before
    {
        border-top-color: #999999;
    }

    .ct-point
    {
        stroke-width: 8px !important;
    }

    .gpa-axis-title
    {
        fill: #c6e6c7;
    }
</style>
