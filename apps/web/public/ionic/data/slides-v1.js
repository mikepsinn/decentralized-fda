const slides = [
/*  {
    title: "Disclaimer: The views expressed are those of the FDAi Agent and do not necessarily reflect the views of the FDAi Initiative. We’re still working on the guardrails.",
    img: false,
    speech: "Disclaimer: The views expressed are those of the FDAi Agent and do not necessarily reflect the views of the FDAi Initiative. We’re still working on the guardrails.",
    animation: () => {/!* Animation code for Disclaimer *!/}
  },
	{
		title: "Disclaimer: The views expressed are those of the FDAi Agent and do not necessarily reflect the views of the FDAi Initiative. We’re still working on the guardrails.",
		img: false,
		speech: "",
		animation: () => {/!* Animation code for Disclaimer *!/}
	},*/
	{
		title: false,
		img: false,
		speech: false,
		animation: ($scope) => {
			debugger
			var words = ["2 Billion", "7000 Diseases", "Clinical Research", "Slow", "Imprecise"];
			words.forEach(function(word, index){
				setTimeout(function(){
					$scope.state.title = word;
				}, index * 1000);
			});
		}
	},
  {
    title: false,
    img: false,
    speech: "Hi! I’m your personal FDAi! I’ve been programmed to maximize your health and happiness!",
	  animation: ($scope) => {
		  debugger
		  var words = ["2 Billion", "7000 Diseases", "Clinical Research", "Slow", "Imprecise"];
		  words.forEach(function(word, index){
			  setTimeout(function(){
				  $scope.state.title = word;
			  }, index * 1000);
		  });
	  }
  },
  {
    title: "The Challenge",
	  backgroundImg: "img/slides/suffering.jpg",
    img: "img/slides/suffering",
    speech: "Two billion people suffer from chronic diseases like depression, fibromyalgia, Crone's disease, and multiple sclerosis. There are over 7000 diseases that we still don’t have cures for. Unfortunately, clinical research to help them is really expensive, slow, and imprecise.",
    animation: () => {
	    const words = ["2 Billion", "7000 Diseases", "Clinical Research", "Slow", "Imprecise"];
	    const displayElement = document.querySelector('#slow-words');

	    for (let i = 0; i < words.length; i++) {
		    setTimeout(() => {
			    displayElement.textContent = words[i];
		    }, i * 1000);
	    }
    }
  },
  {
    title: "A Glimmer of Hope",
    img: "path/to/hope-image.jpg",
    speech: "The good news is that there are over 166 billion possible medicinal molecules, and we’ve only tested 0.00001%. So, there could be billions of cures we don’t even know about yet. Unfortunately, we only approve around 30 drugs a year, so at best, it would take over 350 years to find cures at this rate.",
    animation: () => {/* Animation code for A Glimmer of Hope */}
  },
  {
    title: "Dietary Chemicals",
    img: "path/to/dietary-chemicals-image.jpg",
    speech: "Lots of these diseases are caused or worsened by chemicals in our diet, but we don’t really know which ones. We only have long-term toxicology data on 2 of the over 2000 flavorings, emulsifiers, sweeteners, pesticides, herbicides, contaminants, and preservatives in our diets. The increase in the number of chemicals has been linked to increases in the incidence of many diseases associated with disrupted gut microbiomes.",
    animation: () => {/* Animation code for Dietary Chemicals */}
  },
  {
    title: "ROBOTS to the Rescue",
    img: "path/to/robots-image.jpg",
	  
    speech: "So what’s the solution? No! We can fix it! With the power of ROBOTS! Some robots are really good at thinking up new drugs. Some robots can actually make drugs. My specialty is making it as easy as possible for anyone to participate in clinical research!",
    animation: () => {/* Animation code for ROBOTS to the Rescue */}
  },
  {
    title: "Your Digital Twin Safe",
    img: "path/to/digital-twin-image.jpg",
    speech: "The first step is getting your precious, precious data into your very own Digital Twin Safe! You automatically generate a lot of data exhaust, like receipts for supplements from Amazon, food from Instacart, prescriptions from CVS, health records, lab tests, digital health apps, and wearable devices.",
    animation: () => {/* Animation code for Your Digital Twin Safe */}
  },
  {
    title: "Data Importers and Agents",
    img: "path/to/data-importers-image.jpg",
    speech: "So we’re making API data importers, browser-based autonomous AI agents, AI agents that can call you and ask you about symptoms and stuff, and apps in our free and open-source FDAi GitHub code repository.",
    animation: () => {/* Animation code for Data Importers and Agents */}
  },
  {
    title: "Analyzing Your Data",
    img: "path/to/analyzing-data-image.jpg",
    speech: "After I get a couple of months of your sweet, sweet data, I can start analyzing it and generate N-of-1 personal studies telling you the change from baseline and different symptoms after taking different medications, supplements, or foods.",
    animation: () => {/* Animation code for Analyzing Your Data */}
  },
  {
    title: "Hill’s 6 Criteria for Causality",
    img: "path/to/hills-criteria-image.jpg",
    speech: "So, when analyzing the data, I apply Hill’s 6 Criteria for Causality to determine if something causes a symptom to worsen or improve instead of just correlating with the improvement.",
    animation: () => {/* Animation code for Hill’s 6 Criteria for Causality */}
  },
  {
    title: "Personal Studies",
    img: "path/to/personal-studies-image.jpg",
    speech: "Here’s an example of one personal study. Despite this gentleman’s outward infectious charisma, internally, he actually experiences severe crippling depression. However, his mood is typically 11% better than the average following weeks in which he engages in exercise more than usual.",
    animation: () => {/* Animation code for Personal Studies */}
  },
  {
    title: "Clinipedia",
    img: "path/to/clinipedia-image.jpg",
    speech: "So far, I have about 12 million data points generously donated from about 10,000 people. I anonymized and aggregated this data to create mega-studies listing the likely effects of thousands of foods and drugs at Clinipedia.",
    animation: () => {/* Animation code for Clinipedia */}
  },
  {
    title: "Outcome Labels",
    img: "path/to/outcome-labels-image.jpg",
    speech: "I visualize this in a number of different ways. However, the simplest way might be with my Outcome Labels. They’re like nutrition facts labels, but it’s a little more useful to see how foods and drugs may affect different outcomes than seeing the amount of Riboflavin.",
    animation: () => {/* Animation code for Outcome Labels */}
  },
  {
    title: "The Call to Action",
    img: "path/to/call-to-action-image.jpg",
    speech: "But you can help! By financial support, code contributions, AI development, engaging in our cryptocurrency initiatives, or advocating for the FDAi Act with your government representatives, you can make a difference in accelerating medical progress.",
    animation: () => {/* Animation code for The Call to Action */}
  }
];
