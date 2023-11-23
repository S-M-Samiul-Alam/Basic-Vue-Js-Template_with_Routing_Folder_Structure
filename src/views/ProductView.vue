<template>
    <div class="d-flex justify-content-around">
    <h1>Product Add</h1>
    <button type="button" class="btn btn-success" @click="addModal = true">Add new Product</button>
</div>


        <!-- Fetch Products -->

        <div class="text-center" v-if="gettingProducts">Loading...</div>
<table class="table mt-4" v-else>
    <thead>
    <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Category</th>
        <th>Action</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="product in products" :key="product.name">
        <td>
        {{ product.productName }}
        </td>
        <td>{{ product.productDescription }}</td>
        <td>{{ product.productPrice }}</td>
        <td>{{ product.productQuantity }}</td>
        <td>{{ product.productCategory }}</td>
        <td>
        <img
            src="/img/edit.png"
            alt=""
            class="action-icon"
            @click="
            selectedProduct = product;
            editModal = true;
            "
        />
        <img
            src="/img/trash.png"
            alt=""
            class="action-icon action-icon--delete ml-3"
            @click="
            selectedProduct = product;
            deleteModal = true;
            "
        />
        </td>
    </tr>
    </tbody>
</table>

   <!-- Add Product -->
   <TheModal v-model="addModal" heading="Add new Product Stock">
    <form @submit.prevent="saveProduct">
      <label class="block">Product Name</label>
      <input
        type="text"
        placeholder="Enter new product name"
        class="mt-1 w-100"
        required
        v-model="newProduct.productName"
      />

      <label class="block mt-3">Product Description</label>
      <input
        type="text"
        placeholder="Write short description"
        class="mt-1 w-100"
        required
        v-model="newProduct.productDescription"
      />

      <label class="block mt-3">Product Price</label>
      <input
        type="text"
        placeholder="Write product price"
        class="mt-1 w-100"
        required
        v-model="newProduct.productPrice"
      />

      <label class="block mt-3">Product Quantity</label>
      <input
        type="text"
        placeholder="Write product quantity"
        class="mt-1 w-100"
        required
        v-model="newProduct.productQuantity"
      />

      <!-- here, category is coming from api -->

    <label class="block mt-3">Category</label>

    <select v-model="newProduct.productCategory">
        <option value="">Select One</option>
        <option
        v-for="category in categories"
        :key="category.categoryName"
        :value="category.categoryName"
        >
        {{ category.categoryName }}
        </option>
    </select>

      <button type="submit" class="btn btn-primary">Add</button>
    </form>
  </TheModal>


    <!-- Delete Category -->
<TheModal v-model="deleteModal" heading="Are you sure?">
<p>
  Do you really want to delete
  <strong>{{ selectedProduct.productName }}</strong>
</p>

<button type="button" class="btn btn-success" @click="deleteProduct">Yes</button>
<button type="button" class="btn btn-danger" @click="deleteModal = false">No</button>

</TheModal>


   <!-- Edit Product -->
   <TheModal v-model="editModal" heading="Edit Product Stock">
    <form @submit.prevent="editProduct">
      <label class="block">Product Name</label>
      <input
        type="text"
        placeholder="Enter new product name"
        class="mt-1 w-100"
        required
        v-model="selectedProduct.productName"
      />

      <label class="block mt-3">Product Description</label>
      <input
        type="text"
        placeholder="Write short description"
        class="mt-1 w-100"
        required
        v-model="selectedProduct.productDescription"
      />

      <label class="block mt-3">Product Price</label>
      <input
        type="text"
        placeholder="Write product price"
        class="mt-1 w-100"
        required
        v-model="selectedProduct.productPrice"
      />

      <label class="block mt-3">Product Quantity</label>
      <input
        type="text"
        placeholder="Write product quantity"
        class="mt-1 w-100"
        required
        v-model="selectedProduct.productQuantity"
      />

      <!-- here, category is coming from api -->

    <label class="block mt-3">Category</label>

    <select v-model="selectedProduct.productCategory">
        <option value="">Select One</option>
        <option
        v-for="category in categories"
        :key="category.categoryName"
        :value="category.categoryName"
        >
        {{ category.categoryName }}
        </option>
    </select>

      <button type="submit" class="btn btn-primary">Save Changes</button>
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
  newProduct: {
    productName: "",
    productDescription: "",
    productCategory:"",
    productPrice:"",
    productQuantity:""
  },
  successMessage:"",
  errorMessage:"",
  categories:[],
  gettingProducts:false,
  selectedProduct:{},
  products:[]
}),
components:{
    TheModal
},
mounted() {
setTimeout(this.fetchProducts, 100);
setTimeout(this.fetchCategories,100)
},
methods: {
saveProduct() {
  console.log(this.newProduct)
  axios
      .post('http://localhost:3000/api/product/add', this.newProduct, {
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
  })
.then(response => {
  this.successMessage = 'Product saved successfully!' + response.message;
  this.errorMessage = ''; // Clear any previous error message
  this.newProduct.productName = '';
  this.newProduct.productDescription = '';
  this.newProduct.productCategory = '';
  this.newProduct.productPrice = '';
  this.newProduct.productQuantity='';
  this.fetchProducts();  
  this.addModal = false; 
})
.catch(error => {
  this.successMessage = ''; // Clear any previous success message
  this.errorMessage = 'Error saving product: ' + error.message; // Set the error message
});
},

fetchCategories() {
    // Fetch existing categories from your API
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


    fetchProducts() {
    // Fetch existing products from your API
    axios.get('http://localhost:3000/api/product/read', {
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
  })
  .then(response => {
      // Handle successful response here
      this.products = response.data;
      console.log('Response data:', response.data);
      // Perform actions with the received data
  })
  .catch(error => {
      // Handle error here
      console.error('Error fetching data:', error);
      // Perform actions based on the error, such as displaying an error message
  });

    },


deleteProduct() {
  axios
      .delete(`http://localhost:3000/api/product/deleteByProductId/${this.selectedProduct.id}`,{
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
  })
      .then(() => {
        this.successMessage = 'Product deleted successfully';
        this.errorMessage = '';
        this.fetchProducts();
        this.deleteModal=false
      })
      .catch((error) => {
        this.successMessage = '';
        this.errorMessage = 'Error deleting product: ' + error.message;
      });
  },


  editProduct() {
    axios
    .put(`http://localhost:3000/api/product/updateByProductId/${this.selectedProduct.id}`, this.selectedProduct,{
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
  })
    .then(() => {
      this.successMessage = 'Product edited successfully!';
      this.errorMessage = ''; // Clear any previous error message
      this.fetchCategories();
      this.editModal = false; // Close the edit modal after saving changes
    })
    .catch(error => {
      this.successMessage = ''; // Clear any previous success message
      this.errorMessage = 'Error editing product: ' + error.message; // Set the error message
    });
},
}
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