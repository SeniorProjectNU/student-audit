<template>
    <v-container
            id="regular-tables"
            fluid
            tag="section"
    >
        <v-row justify="space-between">
            <v-col cols="6" md="2">
                <v-select v-model="pageSize"
                          :items ="pageSizeOptions"
                          prepend-icon="mdi-format-align-justify"
                          menu-props="auto"
                          hide-details
                          label="pageSize"
                          single-line
                >
                </v-select>
            </v-col>
            <v-spacer/>
            <v-col cols="6" md="2">
                <router-link :to="{ name: 'Curriculum', query: { action: 'create' } }">
                    <v-btn
                        color="success">
                        Add curriculum
                    </v-btn>
                </router-link>
            </v-col>
        </v-row>
        <base-material-card
                icon="mdi-calendar-multiple"
                title="Curriculum List"
                class="px-5 py-3"
        >
            <v-simple-table>
                <thead>
                <tr>
                    <th>
                        <input class="mr-3" type="checkbox" @click="selectAll" v-model="allSelected"/>
                    </th>
                    <th class="primary--text display-1">
                        Major
                    </th>
                    <th class="primary--text display-1">
                        Year
                    </th>
                    <th></th>

                </tr>
                </thead>

                <tbody>
                <tr v-for="(plan, index) in curriculums" :key="index" >
                    <td><input type="checkbox" :value=plan.id v-model="selectedCurriculums"/>
                    <td>{{plan.major}}</td>
                    <td>{{plan.year}}</td>
                    <td class="text-right">
                        <router-link tag="button" :to="{ name: 'Curriculum', query: { action: 'edit' } }">
                            <v-tooltip open-delay="83" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                            v-bind="attrs"
                                            v-on="on"
                                            class="mx-1">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Edit</span>
                            </v-tooltip>
                        </router-link>
                        <v-tooltip open-delay="83" bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                        @click="deleteCurriculum(plan.id, index)"
                                        v-bind="attrs"
                                        v-on="on"
                                        color="error"
                                        class="mx-1">
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </td>
                </tr>
                </tbody>
            </v-simple-table>
        </base-material-card>

    </v-container>
</template>

<script>
    export default {

      data () {
        return {
          curriculums: [],
          selectedCurriculums: [],
          allSelected: false,
          pageSize: 10,
          pageSizeOptions: [5, 10, 15, 20, 25, 30],
        }
      },

      methods: {
        getCurriculums() {
          let _this = this;

          _this.curriculums = [
            {
              major: 'Computer Science',
              year: 2012,
              id: 1
            },
            {
              major: 'Political Science',
              year: 2042,
              id: 2
            },
            {
              major: 'Physics',
              year: 2011,
              id: 3
            },
            {
              major: 'Basketball',
              year: 2022,
              id: 4
            },
            {
              major: 'Robotics',
              year: 2018,
              id: 5
            },
            {
              major: 'German language',
              year: 2030,
              id: 6
            },
          ]
        },
        deleteCurriculum(id, index){
          let _this = this;
          _this.curriculums.splice(index, 1);
        },
        selectAll() {
          this.selectedCurriculums = [];
          if (!this.allSelected){
            this.allSelected = true;
            this.curriculums.forEach(x => this.selectedCurriculums.push(x.id))
          } else
            this.allSelected = false
        }
      },

      created() {
        this.getCurriculums();
      },

      watch: {
        selectedCurriculums(val) {
          this.allSelected = val.length === this.curriculums.length
        }
      }
    }
</script>
