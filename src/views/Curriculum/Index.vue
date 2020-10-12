<template>
    <v-container
            fluid
            tag="section"
    >
        <v-container>
            <v-row>
                <v-col>
                    <v-btn
                            class="mr-0 float-right"
                            color="success"
                            @click="addFile = true"
                    >
                        Upload curriculum
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-row justify="center">
            <v-col cols="12">
                <base-material-card>
                    <template v-slot:heading>
                        <div class="display-2 font-weight-light">
                            {{action === 'edit' ? $t("edit") : $t("create") }} curriculum
                        </div>

                        <div class="subtitle-1 font-weight-light">
                            Fill the form
                        </div>
                    </template>

                    <v-form>
                        <v-container class="py-0">
                            <v-row>
                                <v-col
                                        cols="12"
                                        md="6"
                                >
                                    <v-text-field
                                            :disabled="stage !== 0"
                                            v-model="form.curriculum.major"
                                            label="Major"
                                    />
                                </v-col>
                                <v-col
                                        cols="12"
                                        md="6"
                                >
                                    <v-text-field
                                            :disabled="stage !== 0"
                                            label="Year"
                                            v-mask="'####'"
                                            v-model="form.curriculum.year"
                                            v-on:keyup.enter="stage++"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-btn
                                            color="success"
                                            class="mr-0 float-right"
                                            :disabled="form.curriculum.major.length === 0 ||
                                             form.curriculum.year.length === 0"
                                            :class="{ 'd-none': stage!==0 }"
                                            @click="stage++"
                                    >
                                        Next
                                    </v-btn>
                                    <v-btn
                                    color="success"
                                    class="mr-0 float-right"
                                    :class="{ 'd-none': stage===0 }"
                                    @click="stage--"
                                    >
                                        Edit Major/Year
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row
                                    :class="{'d-none': stage !== 1}">
                                <v-col cols="12" md="6">
                                    <v-text-field
                                            v-model="courseToAdd.code"
                                            label="Course code"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                            v-model="courseToAdd.name"
                                            label="Course name"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                            v-model="courseToAdd.type"
                                            label="Course type"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field
                                            v-model="courseToAdd.credits"
                                            type="number"
                                            label="Course credits"
                                    />
                                </v-col>
                            </v-row>
                            <v-row
                            :class="{'d-none': stage !==1 }">
                                <v-col>
                                    <v-btn
                                            color="success"
                                            class="mr-0 float-right"
                                            @click="addCourse"
                                            :disabled="!(courseToAdd.name && courseToAdd.type &&
                                             courseToAdd.code && courseToAdd.credits)"
                                    >
                                        Add course
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </base-material-card>
            </v-col>
        </v-row>
        <base-material-card
                v-if="form.curriculum.courses.length !== 0"
                title="Courses List"
                class="px-5 py-3"
        >
            <v-simple-table>
                <thead>
                <tr>
                    <th class="primary--text display-1">
                        Course code
                    </th>
                    <th class="primary--text display-1">
                        Course name
                    </th>
                    <th class="primary--text display-1">
                        Course type
                    </th>
                    <th class="primary--text display-1">
                        Credits
                    </th>
                    <th></th>

                </tr>
                </thead>

                <tbody>
                <tr v-for="(course, index) in form.curriculum.courses" :key="index" >
                    <td>{{course.code}}</td>
                    <td>{{course.name}}</td>
                    <td>{{course.type}}</td>
                    <td>{{course.credits}}</td>
                    <td class="text-right">
                        <v-tooltip open-delay="83" bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                        @click="removeCourse(index)"
                                        v-bind="attrs"
                                        v-on="on"
                                        class="mx-1">
                                    mdi-close
                                </v-icon>
                            </template>
                            <span>Remove</span>
                        </v-tooltip>
                    </td>
                </tr>
                <tr>
                    <td>Total Credits</td>
                    <td>{{totalCredits}}</td>
                </tr>
                </tbody>
            </v-simple-table>
        </base-material-card>
        <v-dialog
                v-model="addFile"
                max-width="600">
            <v-card>
                <v-card-title class="display-2">
                    Upload Curriculum
                    <v-spacer />

                    <v-icon
                            aria-label="Close"
                            @click="addFile = false"
                    >
                        mdi-close
                    </v-icon>
                </v-card-title>

                <v-card-text>
                    <v-file-input
                            v-model="file"
                            show-size
                            counter
                            placeholder="Select file"
                            prepend-icon="mdi-paperclip"
                            outlined
                            accept=".xlsx"
                    >
                        <template v-slot:selection="{ index, text }">
                            <v-chip
                                    v-if="index < 2"
                                    dark
                                    label
                                    small
                            >
                                {{ text }}
                            </v-chip>
                        </template>
                    </v-file-input>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            text
                            @click="addFile = false, submitFile()"
                    >
                        Ok
                    </v-btn>
                    <v-btn
                            color="primary"
                            text
                            @click="addFile = false"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    export default {
      props: ['action'],

      data () {
        return {
          form: {
            curriculum: {
              id: '',
              year: '',
              major: '',
              courses: []
            }
          },
          courseToAdd:{
            code: '',
            name: '',
            type: '',
            credits: ''
          },
          stage: 0,
          addFile: false,
          file: {}
        }
      },

      methods: {
        addCourse(){
          this.form.curriculum.courses.push(this.courseToAdd);
          this.courseToAdd = {};
          this.scrollToEnd();
        },

        removeCourse(index){
          this.form.curriculum.courses.splice(index,1);
        },

        scrollToEnd(){
          window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        },

        submitFile(){

        }
      },

      computed: {
        totalCredits() {
          let sum = 0;
          this.form.curriculum.courses.forEach(x => sum+=parseInt(x.credits));
          return sum;
        }
      }
    }
</script>