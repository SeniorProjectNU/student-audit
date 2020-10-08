<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
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
  <v-spacer/>
  <v-col
    cols="2">
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
      <v-simple-table selectable>
        <thead>
          <tr>
            <th class="display-1">Required Course</th>
            <th class="display-1">Credits</th>
            <th class="display-1">Taken</th>
            <th class="display-1">Credits</th>
            <th class="display-1">Grade</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in audit"
              :key="item.id"
              :item="item">
          </tr>
        </tbody>
      </v-simple-table>
      <v-row>
        <v-col>
          Total credits taken: {{taken}}
        </v-col>
        <v-col>
          Total credits earned: {{earned}}
        </v-col>
      </v-row>
    </base-material-card>
  </v-container>
</template>

<script>
  export default {
    name: 'DashboardDashboard',
    created: function() {
      // TODO: fetch data from backend:
      // student, courseGPAchart, averageGPAchart, curriculum-transcript
    },
    data () {
      return {
        // TODO: delete dummy variables
        // TODO: data for table
        taken: 0,
        earned: 0,
        student: {
          name: 'Aizhan Uristembek',
          id: 201687073,
          major: 'Computer Science',
          year: 2021,
          mail: 'aizhan.uristembek@nu.edu.kz',
        },
        semesterGPAchart: {
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
        },
        courseGPAchart: {
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
        },
      }
    },

    methods: {
      downloadAudit: function( ) {
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
      complete (index) {
        this.list[index] = !this.list[index]
      },
    },
  }
</script>
