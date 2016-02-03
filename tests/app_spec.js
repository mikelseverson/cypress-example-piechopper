describe("PieChopper [000]", function(){
  beforeEach(function(){
    // visit our local server running the application
    //
    // visiting before each test ensures the app
    // gets reset to a clean state
    //
    // https://on.cypress.io/api/visit
    cy.visit("http://localhost:8080")
  })

  // to make assertions throughout our test
  // we're going to use the should command
  // https://on.cypress.io/api/should

  it("has correct title [001]", function(){
    // https://on.cypress.io/api/title
    cy.title().should("eq", "PieChopper - Chop your startup equity")
  })

  it("has correct h1 [005]", function(){
    // https://on.cypress.io/api/get
    cy.get("h1").should("contain", "Chop your startup equity")
  })

  context("About [002]", function(){
    describe("desktop responsive [001]", function(){
      it("is collapsed by default [003]", function(){
        // https://on.cypress.io/api/parents
        cy.get("#about-section").parents(".collapse").should("not.be.visible")
      })

      it("expands on click [004]", function(){
        // https://on.cypress.io/api/contains
        // https://on.cypress.io/api/click
        cy
          .contains("About").click()
          .get("#about-section")
            .should("be.visible")
            .should("contain", "PieChopper assists startup teams to share their equity fair and square.")
            .parents(".collapse").should("have.css", "height", "66px")
      })
    })

    describe("mobile responsive [002]", function(){
      beforeEach(function(){
        // https://on.cypress.io/api/viewport
        cy.viewport("iphone-6")
      })


      it("displays hamburger menu [003]", function(){
        cy
          // by default the About nav menu is hidden
          .contains("About").should("be.hidden")
          .get("#about-section").should("be.hidden")

          // 'end' is necessary here so 'contains'
          // queries the whole document
          // https://on.cypress.io/api/end

          // now it should be visible after click
          .get(".icon-bar:first").parent().click().end()
          .contains("About").should("be.visible").click()

          // and the about section should now be visible
          .get("#about-section").should("be.visible")
      })
    })
  })

  context("Begin button [006]", function(){
    // the viewport is reset before each test back to the default
    // as defined in our https://on.cypress.io/guides/configuration
    // so we are back to the desktop resolution

    it("scrolls to 'How to chop it? [008]", function(){
      // scroll behavior is difficult to test - but with some
      // basic DOM knowledge we can do this pretty easily
      //
      // to figure out that the window is being scrolled we can simply
      // check the '#model-selection-section' top offset and once that equals
      // the windows scrollY we know its been scrolled to the top
      cy
        .contains("button", "Begin").click()

        // https://on.cypress.io/api/invoke
        // https://on.cypress.io/api/then
        .get("#model-selection-section").invoke("offset").then(function(offset){
          // using a cy.then here to create a closure of the offset

          // https://on.cypress.io/api/window
          cy.window().its("scrollY").should("eq", offset.top)
        })
    })
  })

  context("How to chop it? [00a]", function(){
    it("defaults with Company Roles [009]", function(){
      cy
        .get(".carousel-inner .active").should("contain", "Company Roles")
        .get(".model-selector-desc").should("contain", "The method is inspired by the Foundrs.com website.")

          // https://on.cypress.io/api/find
          .find("a").should("have.attr", "href", "http://foundrs.com/")
    })

    it("can change carousel to Market Value [00b]", function(){
      cy
        .get(".carousel-control.right").click()
        .get(".carousel-inner .active").should("contain", "Market Value")
        .get(".model-selector-desc").should("contain", "The method is inspired by the Slicing Pie website.")
          .find("a").should("have.attr", "href", "http://www.slicingpie.com/")
    })

    it("can change carousel to 'Relative Important' using cy.wait [00d]", function(){
      cy
        .get(".carousel-control.right").click()
        .get(".carousel-inner .active").should("contain", "Market Value")
        .get(".carousel-control.right").click()
        .get(".carousel-inner .active").should("contain", "Relative Importance")
        .get(".model-selector-desc").should("contain", "The method is inspired by the Founders Pie Calculator.")

          // https://on.cypress.io/api/and
          .find("a").should("have.attr", "href").and("include", "www.andrew.cmu.edu/user/fd0n/")
    })

    it("can loop around forward + backwards [00c]", function(){
      cy
        .get(".carousel-control.right").click()
        .get(".carousel-inner .active").should("contain", "Market Value")
        .get(".carousel-control.right").click()
        .get(".carousel-inner .active").should("contain", "Relative Importance")
        .get(".carousel-control.right").click()
        .get(".carousel-inner .active").should("contain", "Company Roles")

        // verify the carousel indicators are correct
        // only 1 is active and its the first li
        .get("ol.carousel-indicators li").should(function($lis){
          expect($lis.filter(".active")).to.have.length(1)
          expect($lis.first()).to.have.class("active")
        })

        // loop back around
        .get(".carousel-control.left").click()
        .get(".carousel-inner .active").should("contain", "Relative Importance")

        // verify the carousel indicators are correct
        // only 1 is active and its the last li
        .get("ol.carousel-indicators li").should(function($lis){
          expect($lis.filter(".active")).to.have.length(1)
          expect($lis.last()).to.have.class("active")
        })
    })

    it("scrolls to How do you contribute? [00e]", function(){
      // this shows an alternate approach to testing whether an
      // element has been scrolled.
      //
      // we take advantage of aliasing instead of using a closure
      // for referencing the window object as 'this.win'
      //
      // https://on.cypress.io/api/as
      cy
        .window().as("win")
        .get("#model-selection-section").contains("button", "Continue").click()
        .get("#contrib-section").invoke("offset").its("top").should(function(top){
          // when we alias anything it becomes available inside of our
          // test's context, allowing us to reference it directly
          expect(top).to.eq(this.win.scrollY)
        })
    })
  })

  context("How do you contribute? [00i]", function(){
    beforeEach(function(){
      cy.get("#contrib-section").as("contrib")
    })

    // the form changes based on which algorithm
    // has been selected with 'Company Roles' being the default
    describe("Company Roles [00l]", function(){
      it("can add a Member C [00h]", function(){
        // https://on.cypress.io/api/within
        // do all of our work within this section
        cy.get("@contrib").within(function(){
          cy
            .get("thead th").should("have.length", 3)
            .get(".member-add-btn").click()
            .get("thead th").should("have.length", 4)

              // https://on.cypress.io/api/last
              .last().should("contain", "Member C")
        })
      })

      it("can remove a Member C [00m]", function(){
        cy.get("@contrib").within(function(){
          cy
            .get(".member-add-btn").click()
            .get("thead th").should("have.length", 4)
            .get("thead th").last().find(".member-remove-btn").click()
            .get("thead th").should("have.length", 3)
              .last().should("not.contain", "Member C")
        })
      })

      it("hides button at max num of columns [00b]", function(){
        cy
          .get("#contrib-section").find("table").find("th").should("have.length", 3)
          .get(".member-add-btn")
            .click().click().click().click()
            .should("be.hidden")
      })

      it("calculates the values between members A + B [00n]", function(){
        // using contains here to select the <tr> with this content
        // so its much easier to understand which row we're focused on

        cy
          .ng("model", "member.name").filter("span").as("members")

            // https://on.cypress.io/api/clear
            // https://on.cypress.io/api/type
            .get("@members").first().clear().type("Jane")
            .get("@members").last().clear().type("John")

        // https://on.cypress.io/api/contains
        cy.contains("tr", "Who had the original idea for the project?")

          // https://on.cypress.io/api/check
          .find("td:eq(1)").find(":checkbox").check()

        cy.contains("tr", "How much does the member participate into technical development?").within(function(){
          // https://on.cypress.io/api/select
          cy
            .get("td:eq(1) select").select("Some")
            .get("td:eq(2) select").select("Plenty")
        })

        cy.contains("tr", "Who would lead the technical team if you would get more personnel?").within(function(){
          // this should uncheck the 1st
          // after we check the 2nd
          cy
            .get("td:eq(1) :checkbox").check().as("chk1")
            .get("td:eq(2) :checkbox").check()
            .get("@chk1").should("not.be.checked")
        })

        cy.contains("tr", "How much does the member contribute to the business expenses").within(function(){
          cy
            .get("td:eq(1) select").select("Some")
            .get("td:eq(2) select").select("Little")
        })

        cy.contains("tr", "Who is or becomes the CEO?").within(function(){
          cy.get("td:eq(1) :checkbox").check()
        })

        // now verify that the tfoot + the slice graph match
        cy
          .get("tfoot td:eq(1)").should("contain", "57.7 %")
          .get("tfoot td:eq(2)").should("contain", "42.3 %")

          .get("#slice-graph").within(function(){
            cy.get("[popover='Jane: 57.7%']")
            cy.get("[popover='John: 42.3%']")
          })
      })

      it("updates Member A + B values in #slice-graph [00o]", function(){
        cy.contains("tr", "How much does the member contribute to the product features?").within(function(){
          cy
            .get("td:eq(1) select").select("Little")
            .get("td:eq(2) select").select("Plenty")
        })

        // when we click the first slice a popover should appear with this content
        .get("#slice-graph").find("[popover]").as("slices").first().click()
        .get(".popover-content").should("contain", "Member A: 16.7%")

        // and we'll just check the [popover='...'] attr for the 2nd
        .get("@slices").last().should("have.attr", "popover", "Member B: 83.3%")
      })
    })

    describe("Market Value [00s]", function(){
      beforeEach(function(){
        // swap to market value
        cy.get(".carousel-control.right").click()
      })

      it("updates Member A + B's value [00r]", function(){
        cy.contains("tr", "How much cash is the member investing?").within(function(){

          // https://on.cypress.io/api/type
          cy
            .get("td:eq(1) input").type(50000)
            .get("td:eq(2) input").type(25000)
        })

        cy.contains("tr", "How much does the member bring in other valuables ").within(function(){
          cy.get("td:eq(2) input").type(10000)
        })

        cy
          .get("tfoot td:eq(1)").should("contain", "58.8 %")
          .get("tfoot td:eq(2)").should("contain", "41.2 %")
      })

      it("validates input and displays errors [00t]", function(){
        cy.contains("tr", "What is the sales commission percent that is usually paid on the market?").within(function(){
          cy
            .get("td:eq(1) input").type(500)
            .parent().should("have.class", "invalid")
            .find(".cell-error-msg").should("contain", "Value must be smaller than 100")
        })

        cy.get("#results-section").should("contain", "Your input seems to contain errors.")
      })
    })
  })

  context("Sharing Results [00u]", function(){
    beforeEach(function(){
      // We want to start a server before each test
      // to control nerwork requests and responses

      // https://on.cypress.io/api/server
      cy.server()
    })

    // simulate the server failing to respond to the share proposal
    it("displays error message in modal when server errors [00v]", function(){
      // https://on.cypress.io/api/route
      cy
        .route({
          method: "POST",
          url: /proposals/,
          status: 500,
          response: ""
        }).as("proposal")
        .get("#results-section").contains("Share").click()

        // https://on.cypress.io/api/wait
        .wait("@proposal")
        .get(".modal").should("contain", "We couldn't save the proposal.")
          .find("h2").should("contain", "Ooops !")

        // after we click on the backdrop the modal should go away
        .get(".modal-backdrop").click().should("not.exist")
    })

    it("sends up correct request JSON [00w]", function(){
      // https://on.cypress.io/api/route
      cy
        .route("POST", /proposals/, {}).as("proposal")
        .get("#results-section").contains("Share").click()
        .wait("@proposal").its("requestJSON").should(function(json){
          expect(json.userId).to.be.a("string")

          // expect there to be 3 keys in models
          // https://on.cypress.io/api/underscore
          expect(Cypress._.keys(json.repo.models)).to.have.length(3)

          // make sure the activeModelId matches on of our repo.models
          var selected = json.repo.models[json.repo.activeModelId]
          expect(selected).to.exist
          expect(selected.name).to.eq("Company Roles")
        })
    })

    it("displays share link on successful response [00x]", function(){
      var id = "12345-foo-bar"

      cy
        .route("POST", /proposals/, {id: id}).as("proposal")
        .get("#results-section").contains("Share").as("share").click()
        .wait("@proposal")

        // share button should now be disabled
        .get("@share").should("be.disabled")

        .get("#link-share-url").should("be.visible")

          // https://on.cypress.io/api/and
          .and("contain", "The following link can be copied and pasted over IM or email.")

        .get("#sharedUrl").should("have.prop", "value").and("include", id)
    })
  })
})