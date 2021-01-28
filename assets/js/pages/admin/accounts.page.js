parasails.registerPage('accounts', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    users: [],
    fullUsers: [],
    currentSortField: '',
    currentSortOrder: 'asc',
    fullNameClass: 'fa fa-sort',
    aliasClass: 'fa fa-sort',
    emailAddressClass: 'fa fa-sort',
    emailStatusClass: 'fa fa-sort',
    isSuperAdminClass: 'fa fa-sort',
    isDisabledClass: 'fa fa-sort',
    totalGamesCountClass: 'fa fa-sort',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, SAILS_LOCALS);
    this.fullUsers = this._marshalEntries(this.users);
    this.users = [...this.fullUsers];
  },

  mounted: async function() {
    var filterEl = document.getElementById('filter');
    filterEl.focus(); // set focus to filter element
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _marshalEntries: function(entries) {
      // Marshal provided array of data and return the modified version.
      return _.map(entries, (entry) => {

        return entry;
      });
    },

    filter() {
      this.users = [...this.fullUsers];
      let criteria = document.getElementById('filter').value;
      this.users = this.users.filter((u) => {
        if (u.fullName.concat(u.alias,u.emailAddress,u.emailStatus).toLowerCase().includes(criteria.toLowerCase())) {
          return u;
        }
      });
    },

    resetTableHeader() {
      this.fullNameClass = 'fa fa-sort';
      this.aliasClass = 'fa fa-sort';
      this.emailAddressClass = 'fa fa-sort';
      this.emailStatusClass = 'fa fa-sort';
      this.isSuperAdminClass = 'fa fa-sort';
      this.isDisabledClass = 'fa fa-sort';
      this.totalGamesCountClass = 'fa fa-sort';
    },

    sortBy(field) {
      this.resetTableHeader();
      if (field !== this.currentSortField) {
        this.currentSortOrder = 'asc'; // reset to ascending
      } else {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      }
      this[field+'Class'] = 'fa fa-sort-' + this.currentSortOrder;
      this.currentSortField = field;
      this.users.sort((a,b) => {
        let modifier = 1;
        if (this.currentSortOrder === 'desc') {
          modifier = -1;
        }
        if (a[this.currentSortField] < b[this.currentSortField]) {
          return -1 * modifier;
        }
        return 1 * modifier;
      });
    },

  }
});
