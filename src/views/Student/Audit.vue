<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row class="text-right">
      <v-spacer></v-spacer>
      <v-col cols="6" md="2">
          <v-btn
            color="success"
            @click="downloadAudit( )"
          >
            Download
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <base-material-card
          color="info"
          icon="mdi-account-details"
          title="Student information"
        >
          <v-card-text >
            <div class="display-2 font-weight-light">
              {{student.name}}
            </div>

            <div class="subtitle-1 font-weight-light">
              {{student.id}}
            </div>
            
            <div class="text--primary font-weight-light">
              {{student.major}}
            </div>

            <div class="text--primary font-weight-light">
              {{student.admissionSemester}}
            </div>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <base-material-card
          color="info"
          class="px-5 py-3"
          icon="mdi-book-education"
          title="Academic standing"
        >
          <v-card-text>
            <v-simple-table dense>
              <tbody>
                <tr>
                  <td>Cumulative GPA</td>
                  <td>{{student.gpa}}</td>
                </tr>
                <tr>
                  <td>Credits Enrolled</td>
                  <td>{{student.creditsEnrolled}}</td>
                </tr>
                <tr>
                  <td>Credits Earned</td>
                  <td>{{student.creditsEarned}}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="6"
      >
        <base-material-chart-card
          :data="courseGPAchart.data"
          :options="courseGPAchart.options"
          :responsive-options="courseGPAchart.responsiveOptions"
          color="#E91E63"
          hover-reveal
          type="Bar"
        >
          <template v-slot:reveal-actions>
          </template>

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Average GPA over course categories
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            
          </p>
        </base-material-chart-card>
      </v-col>

      <v-col
        cols="6"
      >
        <base-material-chart-card
          :data="semesterGPAchart.data"
          :options="semesterGPAchart.options"
          color="success"
          hover-reveal
          type="Line"
        >

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Average GPA over terms
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            
          </p>
        </base-material-chart-card>
      </v-col>
    </v-row>
    <v-row>
      <v-select v-model="selectedCurriculum"
        :items ="curriculums"
        item-text = "major"
        item-value= "id"
        prepend-icon="mdi-format-align-justify"
        menu-props="auto"
        hide-details
        label="Select a curriculum to build a report"
        single-line
      >
      </v-select>
      <v-btn
          color="success"
          @click="buildReport()">
        Create
      </v-btn>
    </v-row>
    <base-material-card
      icon="mdi-format-list-checks"
      title="Audit"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th></th>
            <th class="primary--text display-1">Required Course</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Taken</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Grades</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="course in tableInfo.completeRequirements"
              :key="course.id">
              <td><input type="checkbox" :value=course.id v-model="map2unmap"/></td>
              <td>
                {{course.requirement.name}}
              </td>
              <td>
                {{course.requirement.credit}}
              </td>
              <td>
                <div v-if="course.course.code === course.requirement.patterns">
                  <v-icon
                    color="success"
                    class="mx-1">
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                </div>
                <div v-else-if="course.course.code">
                  {{course.course.code}}
                </div>
                <div v-else>
                  <v-icon
                    color="error"
                    class="mx-1">
                    mdi-close-circle-outline
                  </v-icon>
                </div>
              </td>
              <td>
                {{course.course.credits}}
              </td>
              <td>
                {{course.course.gradePoint}}
              </td>
          </tr>
          <tr v-for="course in tableInfo.unmappedCourses"
              :key="course.id">
              <td><input type="checkbox" :value=course.id v-model="unmappedCourse"/></td>
              <td>
                Unmapped course
              </td>
              <td></td>
              <td>
                {{course.code}}
              </td>
              <td>
                {{course.credits}}
              </td>
              <td>
                {{course.gradePoint}}
              </td>
          </tr>
          <tr v-for="req in tableInfo.unmappedRequirements"
              :key="req.id">
              <td><input type="checkbox" :value=req.id v-model="unmappedReq"/></td>
              <td>
                {{req.name}}
              </td>
              <td>
                {{req.credit}}
              </td>
              <td>
                Unmapped requirement
              </td>
              <td></td>
              <td></td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <v-row class="text-right">
      <v-spacer></v-spacer>
      <v-col cols="3" md="2">
          <v-btn
            color="error"
            @click="mapUnmap()"
          >
            Map/Unmap
            <v-icon>
              mdi-link
            </v-icon>
          </v-btn>
      </v-col>
      <v-col cols="3" md="2">
          <v-btn
            color="error"
            @click="removeAudit()"
          >
            Clear
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { get, post, del } from '../../helpers/api'

  export default {
    name: 'StudentAudit',
    props: [ 'id' ],

    data () {
      return {
        taken: 0,
        earned: 0,
        student: {},
        semesterGPAchart: {},
        courseGPAchart: {},
        tableInfo: [],
        curriculums: [],
        selectedCurriculum: "",
        map2unmap: [],
        unmappedCourse: [],
        unmappedReq: []
      }
    },
    
    methods: {
      getCurriculums() {
        get(this, '/curriculum', '', response=>{
          this.curriculums = response.data;
        })
      },
      getInfo() {
        get(this, '/transcript/student/' + this.$route.params.id, '', response=>{
          this.student = response.data;
        })
      },

      getSemesterChart() {
        this.semesterGPAchart = {
          data: {
            labels: [],
            series: [[]],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.simple({
              fillHoles: true
            }),
            low: 0,
            high: 4.5,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        }

        get(this, '/transcript/student/' + this.$route.params.id, '', response=>{
          var chartInfo = response.data.studentTerms;
          chartInfo.forEach(x => this.semesterGPAchart.data.labels.push(x.name))
          chartInfo.forEach(x => this.semesterGPAchart.data.series[0].push(x.termGpa))
        })
      },
      // TODO
      getCourseChart() {
        this.courseGPAchart = {
          data: {
            labels: [],
            series: [[]],
          },
          options: {
            axisX: {
              showGrid: false,
            },
            low: 0,
            high: 4.5,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0,
            },
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                },
              },
            }],
          ],
        }
      },
      // TODO
      getReport() {
        get(this, '/report/'+ this.$route.params.id, '', response => {
          this.tableInfo = response.data;
        });
      },
      buildReport( ) {
        let data = {
          curriculumId: this.selectedCurriculum,
          studentId: this.student.id
        }

        post(this, '/report', data, response => {
          this.tableInfo = response.data;
        }, error => {
          console.log(error);
        });
      },
      mapUnmap( ) {
        if(this.map2unmap.length === 0) {
          if(this.unmappedCourse.length === 1 && this.unmappedReq.length === 1) {
            let data = {
              courseId: this.unmappedCourse[0],
              reportId: this.student.id,
              requirementId: this.unmappedReq[0]
            }
            console.log(data)

            post(this, '/report/' + this.studentId + '/mapRequirement', data, response => {
              this.getReport();
              this.unmappedReq = [];
              this.unmappedCourse = [];
              console.log(response);
            }, error => {
              console.log(error);
            });
          } else {
            console.log("There should be only one course and requirement to map");
          }
        }
      },
      downloadAudit( ) {
        // TODO: try
        /*
        axios({
          url: '',
          method: 'GET',
          responseType: 'blob', // important
          headers: { 'Accept': 'application/vnd.ms-excel' }
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'file.pdf');
          document.body.appendChild(link);
          link.click();
        }); */
      },
      removeAudit() {
        del(this, '/report/'+this.student.id, '',  () => this.getReport(),{});
      }
    },

    created() {
      this.getInfo()
      this.getCurriculums()
      this.getCourseChart()
      this.getSemesterChart()
      this.getReport()
    },
  }
</script>
