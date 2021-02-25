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
      <!-- v-col
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
      </v-col -->

      <v-col
        cols="12"
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
        item-value= "id"
        prepend-icon="mdi-format-align-justify"
        menu-props="auto"
        hide-details
        label="Select a curriculum to build a report"
        single-line
      >
        <template slot="selection" slot-scope="data">
          {{ data.item.major }} {{ data.item.year }}
        </template>
        <template slot="item" slot-scope="data">
          {{ data.item.major }} {{ data.item.year }}
        </template>
      </v-select>
      <v-btn
          color="success"
          @click="buildReport()">
        Create
      </v-btn>
    </v-row>
    <base-material-card
      v-if="tableInfo.completeRequirements && tableInfo.completeRequirements.length > 0"
      icon="mdi-text-box-check"
      title="Audit"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th><input class="mr-3" type="checkbox" @click="selectAll" v-model="allSelected"/></th>
            <th class="primary--text display-1">Required Course</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Taken</th>
            <th class="primary--text display-1">Credits</th>
            <th class="primary--text display-1">Grades</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="course in tableInfo.completeRequirements"
              :key="course.id"
              @click.stop="allRowCheckbox(map2unmap, course.requirement.id)">
              <td><input type="checkbox" :value=course.requirement.id v-model="map2unmap"/></td>
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
              </td>
              <td>
                {{course.course.credits}}
              </td>
              <td>
                {{course.course.gradePoint}}
              </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          v-if="tableInfo.unmappedRequirements && tableInfo.unmappedRequirements.length > 0"
          icon="mdi-text-box-remove"
          title="Unmapped requirements"
          class="px-5 py-3"
        >
          <v-simple-table>
            <thead>
              <tr>
                <th></th>
                <th class="primary--text display-1">Required Course</th>
                <th class="primary--text display-1">Credits</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="req in tableInfo.unmappedRequirements"
                  :key="req.id"
                  @click.stop="unmappedReq=req">
                  <td><input type="radio" :value=req v-model="unmappedReq"/></td>
                  <td>
                    {{req.name}}
                  </td>
                  <td>
                    {{req.credit}}
                  </td>
              </tr>
            </tbody>
          </v-simple-table>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          v-if="tableInfo.unmappedCourses && tableInfo.unmappedCourses.length > 0"
          icon="mdi-text-box-plus"
          title="Unmapped courses"
          class="px-5 py-3"
        >
          <v-simple-table>
            <thead>
              <tr>
                <th></th>
                <th class="primary--text display-1">Taken Course</th>
                <th class="primary--text display-1">Credits</th>
                <th class="primary--text display-1">Grades</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="course in tableInfo.unmappedCourses"
                  :key="course.id"
                  @click.stop="unmappedCourse=course">
                  <td><input type="radio" :value=course v-model="unmappedCourse"/></td>
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
            </tbody>
          </v-simple-table>
        </base-material-card>
      </v-col>
    </v-row>
    <v-row class="text-right">
      <v-spacer></v-spacer>
      <v-col cols="3" md="2">
          <v-btn
            v-if="map2unmap.length > 0 || (unmappedCourse !== '' && unmappedReq !== '')"
            color="error"
            @click="dialog = true"
          >
            Map/Unmap
            <v-icon>
              mdi-link
            </v-icon>
          </v-btn>
      </v-col>
      <v-col cols="3" md="2">
          <v-btn
            v-if="tableInfo !== ''"
            color="error"
            @click="del=true, dialog = true"
          >
            Clear
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="warning--text display-2">
          Warning!

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false, del = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="text-center">
          {{del ? 'Are you sure you want to delete?' : (map2unmap.length > 0 ? 'Are you sure you want to unmap the selected row(s)?' : ( unmappedReq.credit > unmappedCourse.credits ? 'Credits do not match' : (unmappedReq !== '' && unmappedCourse !== '' ? 'Are you sure you want to map the selected course to the selected requirement?' : 'Nothing selected or incorrect selection!')))}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="warning"
            text
            @click="dialog = false, del = false, map2unmap = [], unmappedCourse = '', unmappedReq = ''"
          >
            Cancel
          </v-btn>

          <v-btn
            color="warning"
            text
            @click="del === true ? removeAudit() : mapUnmap(), dialog=false, del=false"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        tableInfo: '',
        curriculums: [],
        selectedCurriculum: "",
        map2unmap: [],
        allSelected: false,
        unmappedCourse: '',
        unmappedReq: '',
        dialog: false,
        del: false
      }
    },

    watch: {
      map2unmap(val) {
        this.allSelected = val.length === this.tableInfo.completeRequirements.length;
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
      selectAll( ) {
        this.map2unmap = []
        if( !this.allSelected ) {
          this.allSelected = true
          this.tableInfo.completeRequirements.forEach(x => this.map2unmap.push(x.requirement.id))
        } else {
          this.allSelected = false
        }
      },
      mapUnmap( ) {
        if(this.map2unmap.length === 0) {
          if(this.unmappedReq.credit <= this.unmappedCourse.credits) {
            let query = 'requirementId='+this.unmappedReq.id+'&courseId='+this.unmappedCourse.id;
            post(this, '/report/' + this.student.id + '/mapRequirement?'+query, '', () => this.getReport(), {});
          }
        } else {
          this.map2unmap.forEach(x => post(this, '/report/' + this.student.id + '/detachRequirement?requirementId='+x,
            '', () => this.getReport(), {}));
        }
        this.unmappedReq = '';
        this.unmappedCourse = '';
        this.map2unmap = []
      },
      allRowCheckbox(map2unmap, id) {
        if(map2unmap.includes(id)) {
          map2unmap = map2unmap.splice(map2unmap.indexOf(id),1);
        } else {
          map2unmap.push(id);
        }
      },
      downloadAudit( ) {
        window.print()
      },
      removeAudit() {
        del(this, '/report/'+this.$route.params.id, '',  () => { 
          this.getReport();
        }, {});
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
