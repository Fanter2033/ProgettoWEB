<template>
  <!-- Contenitore principale -->
  <div class="container-fluid">
    <!-- Riga principale con flex-nowrap (senza wrap) -->
    <div class="row flex-nowrap">
      <!-- Colonna laterale sinistra (barra laterale) -->
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <!-- Contenuto della barra laterale -->
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <!-- Logo o link alla home -->
          <div
            class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span class="fs-5 d-none d-sm-inline">Your Vips</span>
          </div>
          <!-- Lista di elementi di navigazione (menu) -->
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <!-- Elemento di menu con submenu: per ora statico con il signor romanellas -->
            <li class="dropdown">
              <a
                href="#submenu3"
                data-bs-toggle="collapse"
                class="nav-link dropdown-toggle px-0 align-middle"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fs-4 bi-person-circle me-1"></i>
                <span class="ms-1 d-none d-sm-inline">romanellas</span>
              </a>
              <!-- Sottomenu di Products -->
              <ul
                class="collapse nav flex-column ms-1"
                id="submenu3"
                data-bs-parent="#menu"
              >
                <li class="w-100">
                  <a href="#" class="nav-link px-0">
                    <i class="fs-4 bi-file-bar-graph"></i>
                    <span class="d-none d-sm-inline">Graphs</span></a
                  >
                </li>
                <li>
                  <a href="#" class="nav-link px-0">
                    <i class="fs-4 bi-send"></i
                    ><span class="d-none d-sm-inline">Squeal</span></a
                  >
                </li>
                <li>
                  <a href="#" class="nav-link px-0">
                    <i class="fs-4 bi-currency-euro"></i
                    ><span class="d-none d-sm-inline">Quote</span></a
                  >
                </li>
              </ul>
            </li>
          </ul>
          <!-- Linea divisoria -->
          <hr />
          <!-- Dropdown per il profilo dell'utente -->
          <div class="dropdown pb-4">
            <!-- Menu dropdown per il profilo dell'utente -->
            <ul
              class="dropdown-menu dropdown-menu-dark text-small shadow"
              aria-labelledby="dropdownUser1"
            >
              <li><a class="dropdown-item" href="#">New Vip</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><a class="dropdown-item" href="#">Profile</a></li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBar",
};
</script>
