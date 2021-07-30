<template>
	<main class="container">
		<!-- un seul bloc pour la creation de commentaire -->
		<section class="row card bg-light m-5 p-3">
			<form enctype="multipart/form-data">
				<div class="header">
					<h1 class="btn btn-dark" style="cursor:default">
						{{ callName() }} vous modifier la publication numéro
						<span class="badge font-weight-bold badge-light"> {{ callNumber() }}</span>
					</h1>
				</div>
				<div class="row">
					<div class="col-12 justify-content-center form-group">
						<label for="newUpdate">À vos claviers...</label>
						<textarea
							v-on:keydown="isInvalid = false"
							class="form-control"
							v-model="newUpdate"
							id="newUpdate"
							name="update"
							rows="8"
							placeholder=" Saisissez votre commentaire ici. (1500 caractères max) "
						></textarea>
					</div>
				</div>
				<div class="footer col-10 mx-auto align-content-center">
					<div><button type="submit" @click.prevent="send()" class="btn btn-dark font=weight-bold btn-block m-2 p-2">Valider</button></div>
					<router-link to="/Stream">
						<div><a class="btn btn-danger btn-block m-2 p-2">Annuler/Retour</a></div></router-link
					>
				</div>
				<div v-show="isInvalid" class="invalidBox m-2" key="invalid">
					<p>Vous devez renseigner la case " Saisissez votre commentaire ici en respectant les instructions (1500 caractères max) "</p>
				</div>
			</form>
		</section>
	</main>
</template>

<script>
import axios from 'axios';
import router from '../router';
import '../main.css';

export default {
	name: 'UpdateComment',
	data() {
		return {
			isAdmin: false,
			currentUserId: '',
			newComment: '',
			comments: [],
			isInvalid: false
		};
	},
	methods: {
		callName() {
			let name = localStorage.getItem('userName');
			return name.charAt(0).toUpperCase() + name.slice(1);
		},
		callNumber() {
			return localStorage.getItem('MessageId');
		},
		send() {
			if (!this.newUpdate || !localStorage.getItem('userId') || !localStorage.getItem('MessageId' || this.newUpdate.length > 1500)) {
				this.isInvalid = true;
			} else {
				let UserId = localStorage.getItem('userId');
				let Update = this.newUpdate.toString();
				let MessageId = localStorage.getItem('MessageId');

				axios
					.post(
						'http://localhost:3000/api/comments/',
						{ UserId, Update, MessageId },
						{ headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
					)
					.then(() => {
						this.UserId = '';
						this.newUpdate = '';

						alert('Commentaire modifié!');
						router.push({ path: 'Update' });
					})
					.catch(error => {
						console.log(error);
					});
			}
		}
	}
};
</script>
