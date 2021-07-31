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
						<label for="newEdit">À vos claviers...</label>
						<textarea
							v-on:keydown="isInvalid = false"
							class="form-control"
							v-model="newEdit"
							id="newEdit"
							name="edit"
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
	name: 'EditComment',
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
		UpdateComment() {
			axios
				.put(
					'http://127.0.0.1:3000/api/commentsCtrl/' + this.$route.params.id,
					{ comment: this.editComment },
					{ headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
				)
				.then(res => {
					if (res.status === 200) {
						alert({
							text: 'Le commentaire à été mis à jour !',
							footer: 'Redirection en cours...',
							icon: 'success',
							timer: 1500,
							showConfirmButton: false,
							timerProgressBar: true,
							willClose: () => {
								router.push(this.messageId.slice(1));
								this.messageId = '';
							}
						});
					}
				})
				.catch(function(error) {
					const codeError = error.message.split('code ')[1];
					let messageError = '';
					switch (codeError) {
						case '400':
							messageError = "Le commentaire n'a pas été mis à jour !";
							break;
						case '401':
							messageError = 'Requête non-authentifiée !';
							break;
					}
					alert({
						title: 'Une erreur est survenue',
						text: messageError || error.message,
						icon: 'error',
						timer: 1500,
						showConfirmButton: false,
						timerProgressBar: true
					});
				});
		}
	},
	beforeMount() {
		axios
			.get('http://127.0.0.1:3000/api/commentsCtrl/' + this.$route.params.id, {
				headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
			})
			.then(res => {
				if (res.data === null) {
					alert({
						title: 'Une erreur est survenue',
						text: "Ce commentaire n'existe pas !",
						icon: 'error',
						timer: 1500,
						showConfirmButton: false,
						timerProgressBar: true,
						willClose: () => {
							router.push('/messages');
						}
					});
				}
				this.editUserId = res.data.UserId;
				this.messageId = '#/comment/' + res.data.MessageId;
				if (this.editUserId == localStorage.getItem('userId')) {
					this.editorTag = '( Utilisateur : ' + res.data.User.userName + ' )';
					this.editComment = res.data.comment;
				} else if (localStorage.getItem('role') == 'true') {
					this.editorTag = '( Administrateur : ' + localStorage.getItem('userName') + ' )';
					this.editComment = res.data.comment;
					this.editorColor = 'text-danger';
				} else {
					alert({
						title: 'Une erreur est survenue',
						text: "Vous n'avez pas accès à cette fonctionnalité !",
						icon: 'error',
						timer: 1500,
						showConfirmButton: false,
						timerProgressBar: true,
						willClose: () => {
							router.push(this.messageId);
						}
					});
				}
			});
	}
};
</script>
