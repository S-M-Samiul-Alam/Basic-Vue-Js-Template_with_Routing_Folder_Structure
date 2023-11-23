<template>
    <div class="d-flex justify-content-around">
        <h1>Stock Category</h1>
        <button type="button" class="btn btn-success" @click="addModal = true">Add new Stock Category</button>
    </div>

    <!-- Fetch Categories -->

    <div class="text-center" v-if="gettingCategories">Loading...</div>
  <table class="table mt-4" v-else>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Type</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in categories" :key="category.categoryName">
        <td>
          {{ category.categoryName }}
        </td>
        <td>{{ category.categoryDescription}}</td>
        <td>{{ category.categoryType }}</td>
        <td>
          <img
            src="/img/edit.png"
            alt=""
            class="action-icon"
            @click="
              selectedCategory = category;
              editModal = true;
            "
          />
          <img
            src="/img/trash.png"
            alt=""
            class="action-icon action-icon--delete ml-3"
            @click="
              selectedCategory = category;
              deleteModal = true;
            "
          />
        </td>
      </tr>
    </tbody>
  </table>

    <!-- Add Category -->
    <TheModal v-model="addModal" heading="Add new Category Stock">
    <form @submit.prevent="saveCategory">
      <label class="block">Category Name</label>
      <input
        type="text"
        placeholder="Enter Stock Category name"
        class="mt-1 w-100"
        required
        v-model="newCategory.categoryName"
      />

      <label class="block mt-3">Category Description</label>
      <input
        type="text"
        placeholder="Write short description"
        class="mt-1 w-100"
        required
        v-model="newCategory.categoryDescription"
      />

      <label class="block mt-3">Category Type</label>
      <input
        type="text"
        placeholder="Write category type"
        class="mt-1 w-100"
        required
        v-model="newCategory.categoryType"
      />
      <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
  </TheModal>

  <!-- Delete Category -->
  <TheModal v-model="deleteModal" heading="Are you sure?">
    <p>
      Do you really want to delete
      <strong>{{ selectedCategory.categoryName }}</strong>
    </p>

    <button type="button" class="btn btn-success" @click="deleteCategory">Yes</button>
    <button type="button" class="btn btn-danger" @click="deleteModal = false">No</button>

  </TheModal>

  <!-- edit category -->


  <TheModal v-model="editModal" heading="Edit Category Stock">
    <form @submit.prevent="editCategory">
      <label class="block">Category Name</label>
      <input
        type="text"
        placeholder="Enter Stock Category name"
        class="mt-1 w-100"
        required
        v-model="selectedCategory.categoryName"
      />

      <label class="block mt-3">Category Description</label>
      <input
        type="text"
        placeholder="Write short description"
        class="mt-1 w-100"
        required
        v-model="selectedCategory.categoryDescription"
      />

      <label class="block mt-3">Category Type</label>
      <input
        type="text"
        placeholder="Write category type"
        class="mt-1 w-100"
        required
        v-model="selectedCategory.categoryType"
      />
      <button type="submit" class="btn btn-primary">Save changes</button>
    </form>
  </TheModal>


    <!-- Display success message if it's not empty -->
    <div v-if="successMessage !== ''" class="success-message">
      {{ successMessage }}
    </div>
    
    <!-- Display error message if it's not empty -->
    <div v-if="errorMessage !== ''" class="error-message">
      {{ errorMessage }}
    </div>

</template>

<script>

import TheModal from '../components/TheModal.vue';
import axios from 'axios';

export default {
  data: () => ({
    addModal: false,
    deleteModal:false,
    editModal:false,
    newCategory: {
      categoryName: "",
      categoryType:"",
      categoryDescription: "",
    },
    successMessage:"",
    errorMessage:"",
    categories:[],
    gettingCategories:false,
    selectedCategory:{},
  }),
  components: {
    TheModal
  },
  mounted() {
    setTimeout(this.fetchCategories, 100);
  },
  methods: {
      saveCategory() {
        axios
          .post('http://localhost:3000/api/category/create', this.newCategory, {
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
      })
          .then(response => {
            this.successMessage = 'Category saved successfully!' + response.message;
            this.errorMessage = ''; // Clear any previous error message
            this.newCategory.name = '';
            this.newCategory.description = '';
            this.newCategory.type = '';
            this.fetchCategories(),
            this.addModal=false
          })
          .catch(error => {
            this.successMessage = ''; // Clear any previous success message
            this.errorMessage = 'Error saving category: ' + error.message; // Set the error message
            console.log(error.response.data);
          });
      },
      fetchCategories() {

        axios.get('http://localhost:3000/api/category/read', {
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
      })
      .then(response => {
          // Handle successful response here
          this.categories = response.data;
          console.log('Response data:', response.data);
          console.log(this.categories)
          // Perform actions with the received data
      })
      .catch(error => {
          // Handle error here
          console.error('Error fetching data:', error);
          // Perform actions based on the error, such as displaying an error message
      });

        },
        deleteCategory() {
        axios
          .delete(`http://localhost:3000/api/category/deleteByCategoryId/${this.selectedCategory.id}`,{
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
      })
          .then(() => {
            this.successMessage = 'Category deleted successfully';
            this.errorMessage = '';
            this.fetchCategories();
            this.deleteModal=false
          })
          .catch((error) => {
            this.successMessage = '';
            this.errorMessage = 'Error deleting category: ' + error.message;
          });
      },
      editCategory() {
      axios
        .put(`http://localhost:3000/api/category/updateByCategoryId/${this.selectedCategory.id}`, this.selectedCategory,{
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }
      })
        .then(() => {
          this.successMessage = 'Category edited successfully!';
          this.errorMessage = ''; // Clear any previous error message
          this.fetchCategories();
          this.editModal = false; // Close the edit modal after saving changes
        })
        .catch(error => {
          this.successMessage = ''; // Clear any previous success message
          this.errorMessage = 'Error editing category: ' + error.message; // Set the error message
        });
    },
    
    },

};
</script>

<style>

img{
  height: 30px;
  width: 30px;
}

.success-message{
  color:green
}

.error-message{
 color: red;
}
</style>