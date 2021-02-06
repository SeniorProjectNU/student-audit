<template>
  <v-container>
      <v-row>
          <v-col
                  v-for="(student, index) in students" :key="index"
                  cols="4"
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
                          {{student.admissionSemester}}
                      </div>
                      <div class="text--primary font-weight-light">
                          {{student.gpa}}
                      </div>
                      <div class="text--primary font-weight-light">
                          {{student.creditsEarned}}
                      </div>
                  </v-card-text>
              </base-material-card>
          </v-col>
      </v-row>
      <v-row>
          <v-col cols="6">
              <chartist type="Line" :data="chartData" :options="chartOptions"></chartist>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
  import {get} from "../../helpers/api";

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
                  legendNames: this.names,
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
          get(_this, '/transcript/students/'+_this.id, {}, response=>{
              _this.students = response.data;
          });
      },
    },
    computed: {
      chartData(){
          let series = [];
          this.students.forEach(student => {
              let arr1 = [];
              student.studentTerms.forEach(term =>{
                  arr1.push({x: term.name, y: term.termGpa});
              });
              series.push(arr1);
          });

          let l = Math.max(...series.map(el => el.length));
          for(let i=0; i<l; l++){
              
              // for(let j=0; j<series.length; j++){}
          }

          let labels = [];
          return {
              labels: labels,
              series: series
          }
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
