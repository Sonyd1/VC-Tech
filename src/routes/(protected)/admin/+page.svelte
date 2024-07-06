<script lang="ts">
  import { enhance } from '$app/forms';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ pendingUsers, approvedUsers } = data);

  let activeTab = 'pending';
  let editingUserId: string | null = null;
  let deletingUser: { id: string, username: string } | null = null;
  let confirmUsername = '';

  function toggleTab(tab: string) {
    activeTab = tab;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  function startEditing(userId: string) {
    editingUserId = userId;
  }

  function stopEditing() {
    editingUserId = null;
  }

  function startDeleting(user: { id: string, username: string }) {
    deletingUser = user;
    confirmUsername = '';
  }

  function cancelDeleting() {
    deletingUser = null;
    confirmUsername = '';
  }

  function handleDeleteSubmit(event: Event) {
    if (confirmUsername !== deletingUser?.username) {
      event.preventDefault();
      alert("Username doesn't match. Please try again.");
    }
  }

  async function handleDelete(event: Event) {
    event.preventDefault();
    if (confirmUsername === deletingUser?.username) {
      const form = event.target as HTMLFormElement;
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
      });
      if (response.ok) {
        // Remove the deleted user from the approvedUsers array
        approvedUsers = approvedUsers.filter(user => user.id !== deletingUser?.id);
        // Close the popup
        deletingUser = null;
        confirmUsername = '';
      } else {
        alert('Failed to delete user. Please try again.');
      }
    }
  }
</script>

<div class="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
  <h1 class="text-3xl font-semibold mb-8 text-gray-800">User Management Dashboard</h1>

  <div class="mb-6 bg-white shadow-md rounded-lg p-4">
    <div class="flex border-b border-gray-200">
      <button
        class="py-2 px-4 font-medium {activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        on:click={() => toggleTab('pending')}
      >
        Pending Approvals
      </button>
      <button
        class="py-2 px-4 font-medium ml-4 {activeTab === 'approved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        on:click={() => toggleTab('approved')}
      >
        Approved Users
      </button>
    </div>
  </div>

  {#if activeTab === 'pending'}
    <!-- Pending users table (unchanged) -->
  {:else}
    {#if approvedUsers.length === 0}
      <p class="text-center text-gray-600 bg-white shadow-md rounded-lg p-4">No approved users yet.</p>
    {:else}
      <div class="bg-white shadow-md rounded-lg overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each approvedUsers as user (user.id)}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td class="px-6 py-4 whitespace-nowrap">{user.role.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{formatDate(user.createdAt)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{formatDate(user.updatedAt)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {#if editingUserId === user.id}
                    <button on:click={() => startDeleting(user)} class="text-red-600 hover:text-red-900 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <button on:click={() => stopEditing()} class="text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  {:else}
                    <button on:click={() => startEditing(user.id)} class="text-blue-600 hover:text-blue-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</div>

{#if deletingUser}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            Type <span class="font-bold">{deletingUser.username}</span> to confirm deletion.
          </p>
          <input
            type="text"
            bind:value={confirmUsername}
            class="mt-2 px-3 py-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter username"
          />
        </div>
        <div class="items-center px-4 py-3">
          <form method="POST" action="?/deleteApproved" on:submit={handleDelete}>
            <input type="hidden" name="userId" value={deletingUser.id} />
            <button
              type="button"
              class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 mr-2"
              on:click={cancelDeleting}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24"
              disabled={confirmUsername !== deletingUser.username}
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* You can add any additional custom styles here */
</style>