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
        lg="3"
      >
        <base-material-stats-card
          color="info"
          icon="mdi-account-details"
          :title=student.id
          :value=student.name
        />
      </v-col>
  </v-row>
    <v-row>
      <v-col
        cols="6"
        lg="4"
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
            Average GPA over courses
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            
          </p>
        </base-material-chart-card>
      </v-col>

      <v-col
        cols="6"
        lg="4"
      >
        <base-material-chart-card
          :data="semesterGPAchart.data"
          :options="semesterGPAchart.options"
          color="success"
          hover-reveal
          type="Line"
        >

          <h4 class="card-title font-weight-light mt-2 ml-2">
            Semester GPAs
          </h4>

          <p class="d-inline-flex font-weight-light ml-2 mt-1">
            
          </p>
        </base-material-chart-card>
      </v-col>
    </v-row>
  <base-material-card
      icon="mdi-format-list-checks"
      title="Audit"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th class="primary--text display-1">Required Course</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Taken</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Grade</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="course in tableInfo"
              :key="course.id">
              <td>
                {{course.req.name}}
              </td>
              <td>
                {{course.req.credits}}
              </td>
              <td>
                <div v-if="course.taken.name === course.req.name">
                  <v-icon
                    color="success"
                    class="mx-1">
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                </div>
                <div v-else-if="course.taken.name">
                  {{course.taken.name}}
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
                {{course.taken.credits}}
              </td>
              <td>
                <div v-for="(grade, index) in course.taken.grades"
                  :key="index">
                  {{grade}} 
                </div>
              </td>
          </tr>
          <tr>
            <td>
              Total credits taken
            </td>
            <td>
              {{taken}}
            </td>
            <td>
              Total credits earned
            </td>
            <td>
              {{earned}}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
  </v-container>
</template>

<script>
  export default {
    name: 'StudentAudit',
    props: [ 'id' ],

    data () {
      return {
        // TODO: data for table
        taken: 0,
        earned: 0,
        student: {},
        semesterGPAchart: {},
        courseGPAchart: {},
        tableInfo: [],
      }
    },
    
    methods: {
      // TODO: get data from back
      getStudentInfo() {
        this.student = {
          name: 'Anna Ivanova',
          id: 201687073,
          major: 'Computer Science',
          year: 2021,
          mail: 'anna.ivanova@nu.edu.kz',
        }
      },
      getSemesterChart() {
        this.semesterGPAchart = {
          data: {
            labels: ['Fall 2017', 'Spring 2018', 'Summer 2018', 'Fall 2018',
                    'Spring 2019', 'Fall 2019', 'Spring 2020', 'Fall 2020', 'Spring 2021'],
            series: [
              [3.77, 3.65, 4.00, 3.16, 3.00, 3.50, 3.72],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
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
      },
      getCourseChart() {
        this.courseGPAchart = {
          data: {
            labels: ['Core', 'Math', 'Natural', 'SHSS', 'Free'],
            series: [
              [3.35, 3.52, 3.75, 3.58, 3.55],
            ],
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
      getReport() {
        this.taken = 34
        this.earned = 20
        this.tableInfo = [
          {
            req: {
              name: "CSCI 152 - Programming for beginners",
              credits: 8,
            },
            taken: {
              name: "CSCI 152 - Programming for beginners",
              credits: 8,
              grades: [ "B+" ]
            }
          },
          {
            req: {
              name: "Natural science elective",
              credits: 6,
            },
            taken: {
              name: "BIOL 110 - Modern Biology I",
              credits: 8,
              grades: [ "F", "A" ]
            }
          },
          {
            req: {
              name: "CSCI 409 - Senior project",
              credits: 6,
            },
            taken: {}
          },
          {
            req: {
              name: "CSCI 272 - Algorithms",
              credits: 6,
            },
            taken: {
              name: "CSCI 272 - Algorithms",
              credits: 6,
              grades: [ "W", "B" ]
            }
          }
        ]
      },
      downloadAudit( ) {
        // TODO: try after Nurken imports axios
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
    },

    created() {
      this.getStudentInfo()
      this.getCourseChart()
      this.getSemesterChart()
      this.getReport()
    },
  }
</script>
