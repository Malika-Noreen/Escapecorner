"use strict";

(function () {
  const routes = {
    home: "main.html",
    main: "main.html",
    categories: "categoryselection.html",
    cart: "cartcheckout.html",
    contact: "contactus.html",
    profile: "profile.html",
    friendship: "friendship.html",
    "love stories": "lovestory.html",
    motivational: "motivation.html",
    motivation: "motivation.html",
    horror: "horror.html",
    "escape & adventure": "escape-adventure.html",
    "escape / adventure": "escape-adventure.html",
    adventure: "escape-adventure.html"
  };

  const categoryColors = {
    Friendship: { primary: "#b9d7fa", text: "#2d4b68" },
    "Love Stories": { primary: "#fbdae1", text: "#634c51" },
    Motivational: { primary: "#fff2ad", text: "#5c4b08" },
    Horror: { primary: "#eadcff", text: "#4b305e" },
    Adventure: { primary: "#d9ead7", text: "#355040" }
  };

  const books = [
    ["The Quiet Bond", "Eleanor Vance", 24.0, "Friendship"],
    ["Beyond the Shore", "Marcus Thorne", 21.0, "Friendship"],
    ["Golden Echoes", "S. J. Aris", 23.5, "Friendship"],
    ["Parallel Paths", "Lina Rossi", 20.0, "Friendship"],
    ["The Open Door", "Thomas Key", 22.0, "Friendship"],
    ["The Waves", "Virginia Woolf", 24.0, "Friendship"],
    ["Middlemarch", "George Eliot", 18.5, "Friendship"],
    ["To the Lighthouse", "Virginia Woolf", 22.0, "Friendship"],
    ["Brideshead Revisited", "Evelyn Waugh", 26.0, "Friendship"],
    ["Conversations with Friends", "Sally Rooney", 19.99, "Friendship"],
    ["Great Expectations", "Charles Dickens", 15.0, "Friendship"],
    ["Paper Hearts", "Julianne Thorne", 18.5, "Love Stories"],
    ["Eternal Autumn", "Sarah J. Marrow", 22.0, "Love Stories"],
    ["Woven Whispers", "Elena Vance", 19.95, "Love Stories"],
    ["The Midnight Letter", "Jonathan Reeves", 16.75, "Love Stories"],
    ["Sunlight & Sea Glass", "Clara Sterling", 21.5, "Love Stories"],
    ["Velvet Shadows", "R. L. Harrison", 18.9, "Love Stories"],
    ["Atomic Shifts", "James Clear", 24.0, "Motivational"],
    ["The Focused Mind", "Cal Newport", 28.5, "Motivational"],
    ["The Inner Ascent", "Brianna Wiest", 22.0, "Motivational"],
    ["Four Thousand Weeks", "Oliver Burkeman", 26.0, "Motivational"],
    ["Stoic Reflections", "Marcus Aurelius", 19.99, "Motivational"],
    ["The Disciplined Pursuit", "Greg McKeown", 25.5, "Motivational"],
    ["Living Beyond Fear", "Elizabeth Gilbert", 21.0, "Motivational"],
    ["Owning Your Focus", "Nir Eyal", 27.0, "Motivational"],
    ["The Last Compass", "S. J. Marrow", 22.0, "Adventure"],
    ["The Great Unknown", "Elias Thorne", 25.0, "Adventure"],
    ["The Ridge", "William H. Roberts", 28.0, "Adventure"],
    ["Wayfinder", "Sarah Jenkins", 24.5, "Adventure"],
    ["Silent Woods", "Arthur Miller", 32.0, "Adventure"],
    ["Peak Pursuit", "George Byron", 19.99, "Adventure"],
    ["Azure Horizon", "Elizabeth Swann", 26.0, "Adventure"],
    ["Canyon Echo", "James Carter", 22.0, "Adventure"],
    ["The Haunting of Hill House", "Shirley Jackson", 24.0, "Horror"],
    ["Mexican Gothic", "Silvia Moreno-Garcia", 22.5, "Horror"],
    ["The Shining", "Stephen King", 19.99, "Horror"],
    ["Bird Box", "Josh Malerman", 18.0, "Horror"],
    ["The Only Good Indians", "Stephen Graham Jones", 26.0, "Horror"],
    ["The Silent Patient", "Alex Michaelides", 21.0, "Horror"],
    ["House of Leaves", "Mark Z. Danielewski", 28.9, "Horror"],
    ["The Cabin at the End of the World", "Paul Tremblay", 23.0, "Horror"]
  ].map(([title, author, price, category]) => ({ title, author, price, category }));

  const bookMap = new Map(books.map((book) => [normalize(book.title), book]));

  function normalize(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function slugify(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function formatPrice(value) {
    const number = typeof value === "number" ? value : Number.parseFloat(String(value).replace(/[^0-9.]/g, ""));
    return `$${number.toFixed(2)}`;
  }

  function hashNumber(value, max) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    return hash % max;
  }

  function categoryToRoute(category) {
    return routes[normalize(category)] || routes.categories;
  }

  function generateCover(book) {
    const palette = categoryColors[book.category] || categoryColors.Friendship;
    const titleLines = splitTitle(book.title);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
        <rect width="600" height="900" fill="${palette.primary}"/>
        <circle cx="480" cy="160" r="120" fill="rgba(255,255,255,0.22)"/>
        <circle cx="140" cy="760" r="150" fill="rgba(255,255,255,0.18)"/>
        <rect x="56" y="56" width="12" height="788" rx="6" fill="${palette.text}"/>
        <text x="110" y="260" fill="${palette.text}" font-family="Georgia, serif" font-size="54" font-style="italic">
          ${titleLines.map((line, idx) => `<tspan x="110" dy="${idx === 0 ? 0 : 68}">${escapeXml(line)}</tspan>`).join("")}
        </text>
        <text x="110" y="700" fill="${palette.text}" font-family="Arial, sans-serif" font-size="22" letter-spacing="3">${escapeXml(book.author.toUpperCase())}</text>
        <text x="110" y="748" fill="${palette.text}" font-family="Arial, sans-serif" font-size="18" letter-spacing="4">${escapeXml(book.category.toUpperCase())}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function splitTitle(title) {
    const words = title.split(" ");
    if (words.length <= 2) {
      return [title];
    }
    const midpoint = Math.ceil(words.length / 2);
    return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function buildDetailUrl(book, imageSrc, imageAlt) {
    const params = new URLSearchParams({
      title: book.title,
      author: book.author,
      price: formatPrice(book.price),
      category: book.category
    });
    if (imageSrc) {
      params.set("image", imageSrc);
    }
    if (imageAlt) {
      params.set("alt", imageAlt);
    }
    return `bookdetailed.html?${params.toString()}`;
  }

  function makeNavigable(element, url) {
    if (!element || element.dataset.ecLinked === "true") {
      return;
    }

    if (element.tagName === "A") {
      element.href = url;
    } else {
      element.style.cursor = "pointer";
      element.setAttribute("role", "link");
      if (!element.hasAttribute("tabindex")) {
        element.tabIndex = 0;
      }
      element.addEventListener("click", () => {
        window.location.href = url;
      });
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = url;
        }
      });
    }

    element.dataset.ecLinked = "true";
  }

  function disableLogoNavigation() {
    document.querySelectorAll("nav a, nav div, nav span").forEach((element) => {
      if (normalize(element.textContent) !== "escape corner") {
        return;
      }

      if (element.tagName === "A") {
        const replacement = document.createElement("span");
        replacement.className = element.className;
        replacement.textContent = element.textContent;
        replacement.setAttribute("aria-label", "escape corner");
        replacement.style.cursor = "default";
        element.replaceWith(replacement);
        return;
      }

      element.style.cursor = "default";
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
      delete element.dataset.ecLinked;
    });
  }

  function currentPageMatches(url) {
    return window.location.pathname.toLowerCase().endsWith(url.toLowerCase());
  }

  function buildNavLink(label, url) {
    const link = document.createElement("a");
    const active = currentPageMatches(url);
    link.href = url;
    link.textContent = label;
    link.className = active
      ? "font-sans tracking-widest uppercase text-xs text-[#44627f] border-b-2 border-[#44627f] pb-1 transition-colors duration-300"
      : "font-sans tracking-widest uppercase text-xs text-slate-500 hover:text-[#44627f] transition-colors duration-300";
    return link;
  }

  function harmonizeNavigationLayout() {
    document.querySelectorAll("nav").forEach((nav) => {
      const topRow = nav.firstElementChild;
      if (!topRow) {
        return;
      }

      topRow.className = "mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center px-8 py-4";

      const existingLogo =
        Array.from(topRow.querySelectorAll("span, div, a")).find((element) => normalize(element.textContent) === "escape corner") ||
        document.createElement("span");
      const existingActions =
        Array.from(topRow.children).find((child) => child.querySelector("button, .material-symbols-outlined, a[aria-label='Cart'], a[aria-label='Profile']")) ||
        Array.from(topRow.querySelectorAll("div")).find((child) => child.querySelector("button, .material-symbols-outlined"));

      const logoWrapper = document.createElement("div");
      logoWrapper.className = "justify-self-start";

      const logoElement = document.createElement("span");
      logoElement.className = existingLogo.className || "text-2xl font-serif italic text-[#44627f]";
      logoElement.textContent = "escape corner";
      logoElement.style.cursor = "default";
      logoWrapper.appendChild(logoElement);

      const menu = document.createElement("div");
      menu.className = "hidden md:flex items-center gap-8 justify-self-center";
      menu.appendChild(buildNavLink("Main", routes.main));
      menu.appendChild(buildNavLink("Categories", routes.categories));
      menu.appendChild(buildNavLink("Cart", routes.cart));
      menu.appendChild(buildNavLink("Contact", routes.contact));

      const actions = existingActions ? existingActions.cloneNode(true) : document.createElement("div");
      actions.classList.add("justify-self-end");

      topRow.innerHTML = "";
      topRow.appendChild(logoWrapper);
      topRow.appendChild(menu);
      topRow.appendChild(actions);
    });
  }

  function findClosestCard(element) {
    let current = element;
    while (current && current !== document.body) {
      const text = current.innerText || "";
      if (current.querySelector("img") && text.length < 900) {
        return current;
      }
      current = current.parentElement;
    }
    return element.parentElement;
  }

  function getImageForCard(card) {
    const image = card ? card.querySelector("img") : null;
    return {
      src: image ? image.getAttribute("src") : "",
      alt: image ? (image.getAttribute("alt") || image.dataset.alt || "") : ""
    };
  }

  function wireGlobalNavigation() {
    const navTargets = {
      main: routes.main,
      categories: routes.categories,
      cart: routes.cart,
      contact: routes.contact,
      shopping_cart: routes.cart,
      mail: routes.contact,
      person: routes.profile,
      profile: routes.profile,
      "my profile": routes.profile
    };

    document.querySelectorAll("nav a, nav button, nav div, nav span, footer a, footer div, footer span").forEach((element) => {
      const url = navTargets[normalize(element.textContent)];
      if (url) {
        makeNavigable(element, url);
      }
    });

    document.querySelectorAll("a, button").forEach((element) => {
      const label = normalize(element.textContent);
      if (label === "explore the collection" || label === "view all genres" || label === "continue shopping") {
        makeNavigable(element, routes.categories);
      }
      if (label === "view knowledge base") {
        makeNavigable(element, routes.contact);
      }
      if (label === "finalize order") {
        element.addEventListener("click", (event) => {
          event.preventDefault();
          alert("Your order is ready for review. This demo site now connects the shopping flow end to end.");
        });
      }
    });
  }

  function wireCategoryCards() {
    const headings = document.querySelectorAll("h2, h3");
    headings.forEach((heading) => {
      const route = routes[normalize(heading.textContent)];
      if (!route || route === routes.categories) {
        return;
      }

      makeNavigable(heading, route);
      const card = findClosestCard(heading);
      if (card && card.dataset.ecCardLinked !== "true") {
        card.style.cursor = "pointer";
        card.addEventListener("click", (event) => {
          if (event.target.closest("a, button, input, textarea, select")) {
            return;
          }
          window.location.href = route;
        });
        card.dataset.ecCardLinked = "true";
      }
    });
  }

  function wireBookCards() {
    document.querySelectorAll("h3, h4").forEach((titleElement) => {
      const book = bookMap.get(normalize(titleElement.textContent));
      if (!book) {
        return;
      }

      const card = findClosestCard(titleElement);
      const image = getImageForCard(card);
      const url = buildDetailUrl(book, image.src, image.alt);

      makeNavigable(titleElement, url);

      const imgElement = card ? card.querySelector("img") : null;
      if (imgElement) {
        makeNavigable(imgElement, url);
      }

      if (card && card.dataset.ecBookLinked !== "true") {
        card.style.cursor = "pointer";
        card.addEventListener("click", (event) => {
          if (event.target.closest("a, button, input, textarea, select")) {
            return;
          }
          window.location.href = url;
        });
        card.dataset.ecBookLinked = "true";
      }

      if (card) {
        card.querySelectorAll("button").forEach((button) => {
          const label = normalize(button.textContent);
          if (label.includes("add") || label.includes("buy now") || label.includes("shopping_cart")) {
            button.addEventListener("click", (event) => {
              event.preventDefault();
              const params = new URLSearchParams({ book: book.title });
              window.location.href = `${routes.cart}?${params.toString()}`;
            });
          }
        });
      }
    });
  }

  function buildSearchSuggestions(query) {
    const search = normalize(query);
    if (!search) {
      return [];
    }

    return books
      .filter((book) => normalize(book.title).includes(search) || normalize(book.author).includes(search) || normalize(book.category).includes(search))
      .slice(0, 6);
  }

  function navigateToBook(book) {
    if (!book) {
      return;
    }
    window.location.href = buildDetailUrl(book);
  }

  function wireCatalogSearch() {
    const searchInputs = Array.from(document.querySelectorAll('input[placeholder="Search curated titles..."]'));
    searchInputs.forEach((input, index) => {
      const wrapper = input.parentElement;
      if (!wrapper || input.dataset.ecSearchReady === "true") {
        return;
      }

      wrapper.classList.add("relative");

      const results = document.createElement("div");
      results.className = "absolute left-0 right-0 top-full z-50 mt-2 hidden overflow-hidden rounded-lg border border-black/5 bg-white shadow-xl";
      results.setAttribute("role", "listbox");
      results.id = `ec-search-results-${index}`;
      wrapper.appendChild(results);

      const renderResults = (matches) => {
        if (!matches.length) {
          results.innerHTML = '<div class="px-4 py-3 text-sm text-on-surface-variant">No matching books found.</div>';
          results.classList.remove("hidden");
          return;
        }

        results.innerHTML = matches
          .map((book) => `
            <button type="button" class="flex w-full items-start justify-between gap-4 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-surface-container-low last:border-b-0" data-book-title="${escapeXml(book.title)}">
              <span>
                <span class="block text-sm font-semibold text-on-surface">${escapeXml(book.title)}</span>
                <span class="block text-xs uppercase tracking-widest text-on-surface-variant">${escapeXml(book.author)} · ${escapeXml(book.category)}</span>
              </span>
              <span class="text-sm font-semibold text-primary">${formatPrice(book.price)}</span>
            </button>
          `)
          .join("");
        results.classList.remove("hidden");

        results.querySelectorAll("[data-book-title]").forEach((button) => {
          button.addEventListener("click", () => {
            navigateToBook(bookMap.get(normalize(button.getAttribute("data-book-title"))));
          });
        });
      };

      const closeResults = () => {
        results.classList.add("hidden");
      };

      input.addEventListener("input", () => {
        const matches = buildSearchSuggestions(input.value);
        if (!input.value.trim()) {
          closeResults();
          return;
        }
        renderResults(matches);
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const matches = buildSearchSuggestions(input.value);
          if (matches.length) {
            navigateToBook(matches[0]);
          } else {
            renderResults([]);
          }
        }
        if (event.key === "Escape") {
          closeResults();
        }
      });

      document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
          closeResults();
        }
      });

      input.dataset.ecSearchReady = "true";
    });
  }

  function resolveBookFromParams() {
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title") || "The Quiet Bond";
    const base = bookMap.get(normalize(title)) || bookMap.get(normalize("The Quiet Bond"));
    const book = { ...base };

    book.title = params.get("title") || book.title;
    book.author = params.get("author") || book.author;
    book.category = params.get("category") || book.category;
    book.price = Number.parseFloat(String(params.get("price") || book.price).replace(/[^0-9.]/g, ""));
    book.image = params.get("image") || generateCover(book);
    book.alt = params.get("alt") || `${book.title} cover art`;
    book.originalPrice = book.price + 6 + hashNumber(book.title, 7);
    book.pageCount = 240 + hashNumber(book.title, 180);
    book.isbn = `978-1-${String(100000000 + hashNumber(book.title, 900000000)).padStart(9, "0")}`;
    book.delivery = `${2 + hashNumber(book.author, 3)}-${4 + hashNumber(book.title, 2)} business days`;
    book.badge = badgeForCategory(book.category);
    book.description = descriptionForBook(book);
    book.collectionUrl = categoryToRoute(book.category);
    return book;
  }

  function badgeForCategory(category) {
    const badges = {
      Friendship: "Editor's Choice",
      "Love Stories": "Romantic Pick",
      Motivational: "Curator's Pick",
      Adventure: "Trail Favorite",
      Horror: "After Dark Pick"
    };
    return badges[category] || "Featured Title";
  }

  function descriptionForBook(book) {
    const descriptions = {
      Friendship: `${book.title} follows the quiet gravity of connection, pairing intimate character work with a warm, reflective pace. ${book.author} shapes a story about trust, memory, and the kind of companionship that changes a life by degrees rather than spectacle.`,
      "Love Stories": `${book.title} is a tender, emotionally observant romance built on longing, timing, and the small gestures that matter most. ${book.author} balances softness and tension, letting each chapter deepen the relationship at the center of the story.`,
      Motivational: `${book.title} offers clear, practical guidance for readers who want to move with more intention. ${book.author} blends reflective insight with actionable lessons, making the book ideal for anyone rebuilding focus, energy, or personal direction.`,
      Adventure: `${book.title} delivers a wide-horizon reading experience filled with movement, risk, and discovery. ${book.author} anchors the journey with vivid settings and a strong emotional throughline, so the adventure feels both epic and personal.`,
      Horror: `${book.title} is a tense, atmospheric descent into uncertainty, where dread grows through suggestion as much as shock. ${book.author} uses mood, pacing, and psychological pressure to create a story that lingers long after the final page.`
    };
    return descriptions[book.category] || `${book.title} is a featured selection from escape corner, chosen for its memorable voice, strong atmosphere, and lasting emotional pull.`;
  }

  function renderDetailPage() {
    if (!window.location.pathname.toLowerCase().endsWith("bookdetailed.html")) {
      return;
    }

    const book = resolveBookFromParams();
    document.title = `${book.title} | escape corner`;

    const breadcrumbCategory = document.querySelector("main .mb-12 a");
    const breadcrumbCurrent = document.querySelector("main .mb-12 span:last-child");
    const badge = document.querySelector("header .rounded-full");
    const genreText = document.querySelector("header .text-on-surface-variant.text-xs");
    const title = document.querySelector("h1");
    const author = document.querySelector("header p");
    const mainPrice = document.querySelector(".text-3xl.font-body.font-bold.text-primary");
    const originalPrice = document.querySelector(".line-through");
    const description = document.querySelector(".first-letter\\:text-5xl, .first-letter\\:font-headline");
    const coverImage = document.querySelector(".lg\\:col-span-5 img");
    const availability = document.querySelectorAll(".grid.grid-cols-1.sm\\:grid-cols-2 p.text-sm.font-body.font-bold");
    const specs = document.querySelectorAll(".pt-12.grid.grid-cols-3 .text-sm.font-body.font-bold");
    const buyNow = Array.from(document.querySelectorAll("button")).find((button) => normalize(button.textContent) === "buy now");
    const wishlist = Array.from(document.querySelectorAll("button")).find((button) => normalize(button.textContent) === "add to wishlist");
    const similarHeading = Array.from(document.querySelectorAll("section h2")).find((heading) => heading.textContent.includes("Collection"));
    const viewAll = Array.from(document.querySelectorAll("section a")).find((anchor) => normalize(anchor.textContent) === "view all");
    const recGrid = document.querySelector("section .grid.grid-cols-2.md\\:grid-cols-4");

    if (breadcrumbCategory) {
      breadcrumbCategory.textContent = book.category;
      breadcrumbCategory.href = book.collectionUrl;
    }
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = book.title;
    }
    if (badge) {
      badge.textContent = book.badge;
    }
    if (genreText) {
      genreText.textContent = `Genre: ${book.category}`;
    }
    if (title) {
      title.textContent = book.title;
    }
    if (author) {
      author.textContent = `by ${book.author}`;
    }
    if (mainPrice) {
      mainPrice.textContent = formatPrice(book.price);
    }
    if (originalPrice) {
      originalPrice.textContent = formatPrice(book.originalPrice);
    }
    if (description) {
      description.textContent = book.description;
    }
    if (coverImage) {
      coverImage.src = book.image;
      coverImage.alt = book.alt;
    }
    if (availability[0]) {
      availability[0].textContent = "In stock";
    }
    if (availability[1]) {
      availability[1].textContent = book.delivery;
    }
    if (specs[0]) {
      specs[0].textContent = `${book.pageCount} Pages`;
    }
    if (specs[1]) {
      specs[1].textContent = "English";
    }
    if (specs[2]) {
      specs[2].textContent = book.isbn;
    }
    if (similarHeading) {
      similarHeading.textContent = `More from the ${book.category} Collection`;
    }
    if (viewAll) {
      viewAll.href = book.collectionUrl;
    }
    if (buyNow) {
      buyNow.addEventListener("click", () => {
        const params = new URLSearchParams({ book: book.title });
        window.location.href = `${routes.cart}?${params.toString()}`;
      });
    }
    if (wishlist) {
      wishlist.addEventListener("click", () => {
        alert(`${book.title} has been added to your wishlist.`);
      });
    }

    if (recGrid) {
      const recommendations = books.filter((candidate) => candidate.category === book.category && normalize(candidate.title) !== normalize(book.title)).slice(0, 4);
      recGrid.innerHTML = recommendations
        .map((item) => {
          const url = buildDetailUrl(item, generateCover(item), `${item.title} cover art`);
          return `
            <a href="${url}" class="space-y-4 group block">
              <div class="aspect-[3/4] bg-surface-container-low rounded-md overflow-hidden transition-transform duration-300 group-hover:-translate-y-2">
                <img src="${generateCover(item)}" alt="${escapeXml(item.title)} cover art" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-headline italic text-lg">${escapeXml(item.title)}</h4>
                <p class="text-xs font-label tracking-widest uppercase text-on-surface-variant">${escapeXml(item.author)}</p>
              </div>
            </a>
          `;
        })
        .join("");
    }
  }

  function renderCartNotice() {
    if (!window.location.pathname.toLowerCase().endsWith("cartcheckout.html")) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const selected = params.get("book");
    if (!selected) {
      return;
    }

    const header = document.querySelector("main header");
    if (!header) {
      return;
    }

    const notice = document.createElement("div");
    notice.className = "mt-8 inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-xs font-label uppercase tracking-widest text-on-primary-container";
    notice.innerHTML = `<span class="material-symbols-outlined text-sm">check_circle</span>${escapeXml(selected)} added to your sanctuary selection`;
    header.appendChild(notice);
  }

  harmonizeNavigationLayout();
  wireGlobalNavigation();
  disableLogoNavigation();
  wireCategoryCards();
  wireBookCards();
  wireCatalogSearch();
  renderDetailPage();
  renderCartNotice();
})();
