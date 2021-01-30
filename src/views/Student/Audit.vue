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
              {{student.studentId}}
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
        lg="3"
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
            Average GPA over course categories
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
            Average GPA over terms
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
      <v-simple-table
        height=300
        fixed-header>
        <thead>
          <tr>
            <th class="primary--text display-1">Required Course</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Taken</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Grades</th>
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
                    class="mx-1">x`
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
        </tbody>
      </v-simple-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import { get } from '../../helpers/api'

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
      }
    },
    
    methods: {
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
        this.taken = 34
        this.earned = 20
        this.tableInfo = [
          {
            req: {
              name: "CSCI 151 - Programming for Scientists and Engineers",
              credits: 8,
            },
            taken: {
              name: "CSCI 151 - Programming for Scientists and Engineers",
              credits: 8,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "CSCI 152 - Performance and Data Structures",
              credits: 8,
            },
            taken: {
              name: "CSCI 152 - Performance and Data Structures",
              credits: 8,
              grades: [ "B" ]
            }
          },
          {
            req: {
              name: "CSCI 231 - Computer Systems and Organization",
              credits: 6,
            },
            taken: {
              name: "CSCI 231 - Computer Systems and Organization",
              credits: 6,
              grades: [ "B" ]
            }
          },
          {
            req: {
              name: "CSCI 235 - Programming Languages",
              credits: 8,
            },
            taken: {
              name: "CSCI 235 - Programming Languages",
              credits: 8,
              grades: [ "B-" ]
            }
          },
          {
            req: {
              name: "CSCI 270 - Algorithms",
              credits: 6,
            },
            taken: {
              name: "CSCI 270 - Algorithms",
              credits: 6,
              grades: [ "B+" ]
            }
          },
          {
            req: {
              name: "CSCI 272 - Formal Languages",
              credits: 6,
            },
            taken: {
              name: "CSCI 272 - Formal Languages",
              credits: 6,
              grades: [ "B-" ]
            }
          },
          {
            req: {
              name: "CSCI 390 - Artificial Intelligence",
              credits: 6,
            },
            taken: {
              name: "CSCI 390 - Artificial Intelligence",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "CSCI 341 - Database Systems",
              credits: 6,
            },
            taken: {
              name: "CSCI 341 - Database Systems",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "CSCI 361 - Software Engineering",
              credits: 6,
            },
            taken: {
              name: "CSCI 361 - Software Engineering",
              credits: 6,
              grades: [ "B" ]
            }
          },
          {
            req: {
              name: "CSCI 333 - Computer Networks",
              credits: 6,
            },
            taken: {
              name: "CSCI 333 - Computer Networks",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "CSCI 332 - Operating Systems",
              credits: 6,
            },
            taken: {
              name: "CSCI 332 - Operating Systems",
              credits: 6,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "CSCI 307 - Research Methods",
              credits: 6,
            },
            taken: {
              name: "CSCI 307 - Research Methods",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "CSCI 408 - Senior Project I",
              credits: 6,
            },
            taken: {}
          },
          {
            req: {
              name: "CSCI 409 - Senior Project II",
              credits: 6,
            },
            taken: {}
          },
          {
            req: {
              name: "ROBT 206 - Microcontrollers with Lab",
              credits: 8,
            },
            taken: {
              name: "ROBT 206 - Microcontrollers with Lab",
              credits: 8,
              grades: [ "B+" ]
            }
          },
          {
            req: {
              name: "MATH 161 - Calculus I",
              credits: 8,
            },
            taken: {
              name: "MATH 161 - Calculus I",
              credits: 8,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "MATH 162 - Calculus II",
              credits: 8,
            },
            taken: {
              name: "MATH 162 - Calculus II",
              credits: 8,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "MATH 251 - Discrete Mathematics",
              credits: 6,
            },
            taken: {
              name: "MATH 251 - Discrete Mathematics",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "MATH 273 - Linear Algebra with Applications",
              credits: 8,
            },
            taken: {
              name: "MATH 273 - Linear Algebra with Applications",
              credits: 8,
              grades: [ "B-" ]
            }
          },
          {
            req: {
              name: "MATH 321 - Probability",
              credits: 6,
            },
            taken: {
              name: "MATH 321 - Probability",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "CSCI elective",
              credits: 6,
            },
            taken: {
              name: "CSCI 245 - System Analysis and Design",
              credits: 6,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "CSCI elective",
              credits: 6,
            },
            taken: {
              name: "CSCI 447 - Machine Learning: Theory and Practice",
              credits: 6,
              grades: [ "B+" ]
            }
          },
          {
            req: {
              name: "CSCI elective",
              credits: 6,
            },
            taken: {
              name: "CSCI 399 - Internship II",
              credits: 6,
              grades: [ "P" ]
            }
          },
          {
            req: {
              name: "CSCI elective",
              credits: 6,
            },
            taken: {}
          },
          {
            req: {
              name: "PHYS 161 - Physics I for Scientists and Engineers with Laboratory",
              credits: 8,
            },
            taken: {
              name: "PHYS 161 - Physics I for Scientists and Engineers with Laboratory",
              credits: 8,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "PHYS 162 - Physics II for Scientists and Engineers with Laboratory",
              credits: 8,
            },
            taken: {
              name: "PHYS 162 - Physics II for Scientists and Engineers with Laboratory",
              credits: 8,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "Natural Science elective",
              credits: 6,
            },
            taken: {
              name: "BIOL 110 - Modern Biology I with Lab",
              credits: 8,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "Natural Science elective",
              credits: 6,
            },
            taken: {
              name: "CHEM 101 - General Chemistry I",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "HST 100 - History of Kazakhstan",
              credits: 6,
            },
            taken: {
              name: "HST 100 - History of Kazakhstan",
              credits: 6,
              grades: [ "B" ]
            }
          },
          {
            req: {
              name: "Kazakh",
              credits: 6,
            },
            taken: {
              name: "KAZ 101 - Basic Kazakh I",
              credits: 6,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "Kazakh",
              credits: 6,
            },
            taken: {}
          },
          {
            req: {
              name: "Social Science and Humanities elective",
              credits: 6,
            },
            taken: {
              name: "ECON 101 - Introduction to Microeconomics",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "Social Science and Humanities elective",
              credits: 6,
            },
            taken: {
              name: "PHIL 141 - Critical Thinking",
              credits: 6,
              grades: [ "A-" ]
            }
          },
          {
            req: {
              name: "Social Science and Humanities elective",
              credits: 6,
            },
            taken: {}
          },
          {
            req: {
              name: "Social Science and Humanities elective",
              credits: 6,
            },
            taken: {}
          },
          {
            req: {
              name: "Free elective",
              credits: 6,
            },
            taken: {
              name: "CHEM 102 - General Chemistry II",
              credits: 6,
              grades: [ "B+" ]
            }
          },
          {
            req: {
              name: "Free elective",
              credits: 6,
            },
            taken: {
              name: "BIOL 120 - Modern Biology II with Lab",
              credits: 8,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "Extra",
            },
            taken: {
              name: "MATH 263 - Calculus III",
              credits: 8,
              grades: [ "B" ]
            }
          },
          {
            req: {
              name: "Extra"
            },
            taken: {
              name: "CHEM 101L - General Chemistry I lab",
              credits: 2,
              grades: [ "A" ]
            }
          },
          {
            req: {
              name: "Extra",
            },
            taken: {
              name: "CHEM 102L - General Chemistry II lab",
              credits: 2,
              grades: [ "A" ]
            }
          },
        ]
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
    },

    created() {
      this.getInfo()
      this.getCourseChart()
      this.getSemesterChart()
      this.getReport()
    },
  }
</script>
