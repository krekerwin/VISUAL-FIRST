// ===========================================
// Portfolio Website - Vanilla JavaScript
// ===========================================

// Predefined Tags List
const PREDEFINED_TAGS = [
  "Logo Design",
  "Brand Identity",
  "Logo Concept",
  "Rebranding",
  "Thumbnail Design",
  "Social Media Design",
  "Banner Design",
  "Ad Creative",
  "Preview Image",
  "Illustration",
  "Vector Illustration",
  "Flat Design",
  "Line Art",
  "UI Design",
  "Web Design",
  "Landing Page Design",
  "Website Mockup",
  "Poster Design",
  "Presentation Slide",
  "Minimal",
];

class PortfolioManager {
  constructor() {
    this.storageKey = "portfolioWorks";
    this.favoritesKey = "favoriteArtists";
    this.savedWorksKey = "savedWorks";

    this.works = this.loadWorks();
    this.favorites = this.loadFavorites();
    this.savedWorks = this.loadSavedWorks();
    this.filteredWorks = [...this.works];
    this.activeFilters = new Set();
    this.searchQuery = "";
  }

  // Load works from localStorage
  loadWorks() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Save works to localStorage
  saveWorks() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.works));
  }

  // Load saved works from localStorage
  loadSavedWorks() {
    const data = localStorage.getItem(this.savedWorksKey);
    return data ? JSON.parse(data) : [];
  }

  // Save saved works to localStorage
  saveSavedWorks() {
    localStorage.setItem(this.savedWorksKey, JSON.stringify(this.savedWorks));
  }

  // Toggle save work
  toggleSaveWork(workId) {
    if (this.savedWorks.includes(workId)) {
      this.savedWorks = this.savedWorks.filter((id) => id !== workId);
    } else {
      this.savedWorks.push(workId);
    }
    this.saveSavedWorks();
  }

  // Check if work is saved
  isWorkSaved(workId) {
    return this.savedWorks.includes(workId);
  }

  // Load favorites from localStorage
  loadFavorites() {
    const data = localStorage.getItem(this.favoritesKey);
    return data ? JSON.parse(data) : [];
  }

  // Save favorites to localStorage
  saveFavorites() {
    localStorage.setItem(this.favoritesKey, JSON.stringify(this.favorites));
  }

  // Add favorite artist
  addFavorite(artist) {
    if (!this.favorites.find((fav) => fav.name === artist.name)) {
      this.favorites.push({
        ...artist,
        addedDate: new Date().toISOString(),
      });
      this.saveFavorites();
    }
  }

  // Remove favorite artist
  removeFavorite(artistName) {
    this.favorites = this.favorites.filter((fav) => fav.name !== artistName);
    this.saveFavorites();
  }

  // Check if artist is favorited
  isFavorited(artistName) {
    return this.favorites.some((fav) => fav.name === artistName);
  }

  // Add a new work
  addWork(work) {
    work.id = Date.now();
    this.works.push(work);
    this.saveWorks();
    this.applyFilters();
  }

  // Delete a work
  deleteWork(id) {
    this.works = this.works.filter((work) => work.id !== id);
    this.saveWorks();
    this.applyFilters();
  }

  // Get all unique tags
  getAllTags() {
    const tagSet = new Set();
    this.works.forEach((work) => {
      work.tags.forEach((tag) => tagSet.add(tag.trim().toLowerCase()));
    });
    return Array.from(tagSet).sort();
  }

  // Apply filters
  applyFilters() {
    this.filteredWorks = this.works.filter((work) => {
      // Search filter
      const searchMatch =
        this.searchQuery === "" ||
        work.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        work.description
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        work.author.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Tag filter
      const tagMatch =
        this.activeFilters.size === 0 ||
        work.tags.some((tag) =>
          this.activeFilters.has(tag.trim().toLowerCase()),
        );

      return searchMatch && tagMatch;
    });
  }

  // Update search query
  setSearchQuery(query) {
    this.searchQuery = query;
    this.applyFilters();
  }

  // Toggle tag filter
  toggleFilter(tag) {
    const normalizedTag = tag.trim().toLowerCase();
    if (this.activeFilters.has(normalizedTag)) {
      this.activeFilters.delete(normalizedTag);
    } else {
      this.activeFilters.add(normalizedTag);
    }
    this.applyFilters();
  }

  // Clear all filters
  clearFilters() {
    this.activeFilters.clear();
    this.applyFilters();
  }
}

// UI Manager
class UIManager {
  constructor(manager) {
    this.manager = manager;
    this.initElements();
    this.attachEventListeners();
    this.render();
  }

  initElements() {
    // Modals
    this.uploadModal = document.getElementById("uploadModal");
    this.workModal = document.getElementById("workModal");
    this.favoritesModal = document.getElementById("favoritesModal");

    // Upload form
    this.uploadForm = document.getElementById("uploadForm");
    this.imageInput = document.getElementById("imageInput");
    this.titleInput = document.getElementById("titleInput");
    this.descriptionInput = document.getElementById("descriptionInput");
    this.tagsInput = document.getElementById("tagsInput");
    this.authorInput = document.getElementById("authorInput");
    this.instagramInput = document.getElementById("instagramInput");

    // Tag selector elements
    this.tagSearchInput = document.getElementById("tagSearchInput");
    this.availableTags = document.getElementById("availableTags");
    this.selectedTags = document.getElementById("selectedTags");
    this.selectedTagsList = new Set();

    // Image preview elements
    this.imagePlaceholder = document.getElementById("imagePlaceholder");
    this.imagePreview = document.getElementById("imagePreview");

    // UI elements
    this.uploadBtn = document.getElementById("uploadBtn");
    this.closeUploadBtn = document.getElementById("closeUploadBtn");
    this.closeWorkBtn = document.getElementById("closeWorkBtn");
    this.closeFavoritesBtn = document.getElementById("closeFavoritesBtn");
    this.favoritesBtn = document.getElementById("favoritesBtn");
    this.portfolioGrid = document.getElementById("portfolioGrid");
    this.tagsContainer = document.getElementById("tagsContainer");
    this.emptyState = document.getElementById("emptyState");
    this.searchInput = document.getElementById("searchInput");
    this.favoritesList = document.getElementById("favoritesList");
    this.favoritesEmpty = document.getElementById("favoritesEmpty");

    // Modal content
    this.modalImage = document.getElementById("modalImage");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalDescription = document.getElementById("modalDescription");
    this.modalTags = document.getElementById("modalTags");
    this.modalAuthor = document.getElementById("modalAuthor");
  }

  attachEventListeners() {
    // Upload button
    this.uploadBtn.addEventListener("click", () => this.openUploadModal());

    // Favorites button
    this.favoritesBtn.addEventListener("click", () =>
      this.openFavoritesModal(),
    );

    // Close upload modal
    this.closeUploadBtn.addEventListener("click", () =>
      this.closeUploadModal(),
    );

    // Close work modal
    this.closeWorkBtn.addEventListener("click", () => this.closeWorkModal());

    // Close favorites modal
    this.closeFavoritesBtn.addEventListener("click", () =>
      this.closeFavoritesModal(),
    );

    // Upload form submission
    this.uploadForm.addEventListener("submit", (e) => this.handleUpload(e));

    // Tag search
    this.tagSearchInput.addEventListener("input", (e) => {
      this.renderAvailableTags(e.target.value);
    });

    // Tag selection (delegated) - use closest and prevent default to avoid form submission/propagation
    this.availableTags.addEventListener("click", (e) => {
      const btn = e.target.closest(".available-tag-btn");
      if (!btn) return;
      e.preventDefault();
      this.toggleTag(btn.textContent);
    });

    // Remove tag from selected - delegate via closest and prevent default
    this.selectedTags.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".remove-tag");
      if (!removeBtn) return;
      e.preventDefault();
      const tag = removeBtn
        .closest(".selected-tag")
        .textContent.replace("✕", "")
        .trim();
      this.toggleTag(tag);
    });

    // Image preview
    this.imageInput.addEventListener("change", (e) => {
      this.handleImagePreview(e);
    });

    // Search
    this.searchInput.addEventListener("input", (e) => {
      this.manager.setSearchQuery(e.target.value);
      this.render();
    });

    // Modal backdrop click
    this.uploadModal.addEventListener("click", (e) => {
      if (e.target === this.uploadModal) this.closeUploadModal();
    });

    this.workModal.addEventListener("click", (e) => {
      if (e.target === this.workModal) this.closeWorkModal();
    });

    this.favoritesModal.addEventListener("click", (e) => {
      if (e.target === this.favoritesModal) this.closeFavoritesModal();
    });

    // Modal action buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("contact-btn")) {
        this.handleContactAuthor();
      }
      if (e.target.classList.contains("favorite-btn")) {
        this.handleFavoriteArtist(e.target);
      }
      if (e.target.classList.contains("remove-favorite-btn")) {
        this.handleRemoveFavorite(e.target);
      }
    });
  }

  handleUpload(e) {
    e.preventDefault();

    // Validate that at least one tag is selected
    if (this.selectedTagsList.size === 0) {
      alert("Please select at least one tag");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const work = {
        image: event.target.result,
        title: this.titleInput.value,
        description: this.descriptionInput.value,
        tags: Array.from(this.selectedTagsList),
        author: this.authorInput.value,
        instagramUrl: this.instagramInput.value,
      };

      this.manager.addWork(work);
      this.resetUploadForm();
      this.closeUploadModal();
      this.render();
    };

    reader.readAsDataURL(this.imageInput.files[0]);
  }

  resetUploadForm() {
    this.uploadForm.reset();
    this.selectedTagsList.clear();
    this.tagSearchInput.value = "";
    this.updateSelectedTagsDisplay();
    this.renderAvailableTags("");
    this.resetImagePreview();
  }

  resetImagePreview() {
    this.imagePlaceholder.style.display = "flex";
    this.imagePreview.style.display = "none";
    this.imagePreview.src = "";
  }

  handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.imagePlaceholder.style.display = "none";
        this.imagePreview.style.display = "block";
        this.imagePreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openUploadModal() {
    this.uploadModal.classList.add("show");
    this.renderAvailableTags("");
  }

  closeUploadModal() {
    this.uploadModal.classList.remove("show");
  }

  // Tag Selector Methods
  renderAvailableTags(searchQuery = "") {
    this.availableTags.innerHTML = "";

    const filteredTags = PREDEFINED_TAGS.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    filteredTags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "available-tag-btn";
      if (this.selectedTagsList.has(tag)) {
        btn.classList.add("selected");
      }
      btn.textContent = tag;
      this.availableTags.appendChild(btn);
    });
  }

  toggleTag(tag) {
    if (this.selectedTagsList.has(tag)) {
      this.selectedTagsList.delete(tag);
    } else {
      this.selectedTagsList.add(tag);
    }
    this.updateSelectedTagsDisplay();
    this.renderAvailableTags(this.tagSearchInput.value);
  }

  updateSelectedTagsDisplay() {
    this.selectedTags.innerHTML = "";

    Array.from(this.selectedTagsList).forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.className = "selected-tag";
      tagEl.innerHTML = `
                ${tag}
                <button type="button" class="remove-tag">✕</button>
            `;
      this.selectedTags.appendChild(tagEl);
    });

    // Update hidden input for form validation
    this.tagsInput.value = Array.from(this.selectedTagsList).join(",");
  }

  openWorkModal(work) {
    this.modalImage.src = work.image;
    this.modalTitle.textContent = work.title;
    this.modalDescription.textContent = work.description;
    this.modalAuthor.textContent = work.author;

    // Display tags
    this.modalTags.innerHTML = "";
    work.tags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.className = "tag-badge";
      tagEl.textContent = tag;
      this.modalTags.appendChild(tagEl);
    });

    // Store current work for action buttons
    this.currentWork = work;

    // Update favorite button state
    const favoriteBtn = this.workModal.querySelector(".favorite-btn");
    if (this.manager.isFavorited(work.author)) {
      favoriteBtn.textContent = "♥ Favorited";
      favoriteBtn.classList.add("active");
    } else {
      favoriteBtn.textContent = "♡ Favorite";
      favoriteBtn.classList.remove("active");
    }

    this.workModal.classList.add("show");
  }

  closeWorkModal() {
    this.workModal.classList.remove("show");
  }

  openFavoritesModal() {
    this.favoritesModal.classList.add("show");
    this.renderFavorites();
  }

  closeFavoritesModal() {
    this.favoritesModal.classList.remove("show");
  }

  handleContactAuthor() {
    if (this.currentWork && this.currentWork.instagramUrl) {
      window.open(this.currentWork.instagramUrl, "_blank");
    } else if (this.currentWork) {
      alert(
        `${this.currentWork.author} has not provided an Instagram profile URL.`,
      );
    }
  }

  handleFavoriteArtist(btn) {
    if (this.currentWork) {
      const artistName = this.currentWork.author;

      if (this.manager.isFavorited(artistName)) {
        // Remove from favorites
        this.manager.removeFavorite(artistName);
        btn.textContent = "♡ Favorite";
        btn.classList.remove("active");
      } else {
        // Add to favorites
        this.manager.addFavorite({
          name: artistName,
          workCount: 1,
        });
        btn.textContent = "♥ Favorited";
        btn.classList.add("active");
      }
      this.renderFavorites();
    }
  }

  handleRemoveFavorite(btn) {
    const artistCard = btn.closest(".favorite-artist-card");
    const artistName = artistCard.querySelector("h4").textContent;
    this.manager.removeFavorite(artistName);
    this.renderFavorites();
  }

  renderGrid() {
    this.portfolioGrid.innerHTML = "";

    if (this.manager.filteredWorks.length === 0) {
      this.emptyState.classList.add("show");
      return;
    }

    this.emptyState.classList.remove("show");

    this.manager.filteredWorks.forEach((work) => {
      const card = document.createElement("div");
      card.className = "work-card";
      card.innerHTML = `<img src="${work.image}" alt="${work.title}">`;

      card.addEventListener("click", () => this.openWorkModal(work));
      this.portfolioGrid.appendChild(card);
    });
  }

  renderTags() {
    this.tagsContainer.innerHTML = "";

    const allTags = this.manager.getAllTags();

    if (allTags.length === 0) {
      return;
    }

    allTags.forEach((tag) => {
      const tagEl = document.createElement("button");
      tagEl.className = "tag-filter";
      tagEl.textContent = tag;

      if (this.manager.activeFilters.has(tag)) {
        tagEl.classList.add("active");
      }

      tagEl.addEventListener("click", () => {
        this.manager.toggleFilter(tag);
        this.render();
      });

      this.tagsContainer.appendChild(tagEl);
    });
  }

  renderFavorites() {
    this.favoritesList.innerHTML = "";

    if (this.manager.favorites.length === 0) {
      this.favoritesEmpty.style.display = "block";
      this.favoritesList.style.display = "none";
      return;
    }

    this.favoritesEmpty.style.display = "none";
    this.favoritesList.style.display = "flex";

    this.manager.favorites.forEach((favorite) => {
      const card = document.createElement("div");
      card.className = "favorite-artist-card";

      const info = document.createElement("div");
      info.className = "favorite-artist-info";
      info.innerHTML = `
                <h4>${favorite.name}</h4>
                <p>Added: ${new Date(favorite.addedDate).toLocaleDateString()}</p>
            `;

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-favorite-btn";
      removeBtn.textContent = "Remove";

      card.appendChild(info);
      card.appendChild(removeBtn);
      this.favoritesList.appendChild(card);
    });
  }

  render() {
    this.renderGrid();
    this.renderTags();
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const portfolioManager = new PortfolioManager();
  const uiManager = new UIManager(portfolioManager);
});
