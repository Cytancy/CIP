$(document).ready(function() {
	"use strict";

	var config = {
			customEase: [
				CustomEase.create("cipInOut", ".8, .15, .26, .99"),
			],
			slideDefaults: {
				direction: "x",
				reverse: false,
				duration: 1.2,
				offset: -20,
				delay: 0,
			},
			sectionList: ["prefold", "about", "team", "consumer", "producer", "quote", "features", "cta", "footer"]
		}, 
		observers = {
			resize: [],
			mousemove: [],
			scroll: [],
			visibleSlidesUpdated: [],
		},
		documentElement = $(document),
		bodyElement = $("body"),
		components = {
			main: {element: bodyElement.find(".cip-main")},
			sections: {},
		},
		screen = {
			// slideCount: $(".clc-slide").length,
			// visibleSlides: {},
			// mouse: {},
		};

	setupScreen();

	setupScrolling();

	setupSections();

	function setupScreen() {
		screen.isMobileOrTablet = checkMobileOrTablet();

		$(window).on("resize", updateScreen);

		// $(window).on("mousemove", _.throttle(updateMouse, 50));

		updateScreen();

		function checkMobileOrTablet() {
			var check = false;
			
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			
			return check;
		};

		function updateScreen() {
			screen.width = components.main.element.width();

			screen.height = components.main.element.height();

			screen.vw = Math.min(screen.width,  1920) / 100;

			screen.vh = screen.height / 100;

			notifyObservers("resize");
		}

		function updateMouse(event) {
			var keys = ["screenX", "screenY", "clientX", "clientY", "pageX", "pageY", "offsetX", "offsetY"],
				key,
				halfPoint = screen.width / 2;

			while (keys.length) {
				key = keys.shift();

				screen.mouse[key] = event[key];
			}

			screen.mouse.xOffsetRatio = ((event.clientX - halfPoint) / halfPoint);

			notifyObservers("mousemove");
		}
	}

	function setupScrolling() {
		documentElement.on("scroll", _.throttle(function() {
			window.requestAnimationFrame(checkScroll);
		}, 30));

		checkScroll();

		function checkScroll() {
			var scrollPosition = documentElement.scrollTop();

			screen.scrollPosition = scrollPosition;

			notifyObservers("scroll", scrollPosition);
		}
	}

	function setupSections() {
		components.sections.prefold = {
			initialize: function(component, element) {
				var entryTimeline = new TimelineMax({paused: true}),
					logoStart = 1.4;

				_.assign(component, {
					logo: {
						element: element.find(".cip-prefold-nav-logo"),
						c: {element: element.find(".cip-prefold-nav-logo-c")},
						r: {
							1: {element: element.find(".cip-prefold-nav-logo-r-1")},
							2: {element: element.find(".cip-prefold-nav-logo-r-2")},
						},
						u: {element: element.find(".cip-prefold-nav-logo-u")},
						x: {
							1: {
								fill: {element: element.find(".cip-prefold-nav-logo-x-1-fill")},
								cover: {element: element.find(".cip-prefold-nav-logo-x-1-cover")},
							},
							2: {
								fill: {element: element.find(".cip-prefold-nav-logo-x-2-fill")},
								cover: {element: element.find(".cip-prefold-nav-logo-x-2-cover")},
							},
						},
					},
					leftLine: {element: element.find(".cip-prefold-left-line")},
					rightLine: {element: element.find(".cip-prefold-right-line")},
					header: {
						main: {
							a: {
								text: {element: element.find(".cip-prefold-header-main-a .cip-prefold-header-main-text")},
								cover: {element: element.find(".cip-prefold-header-main-a .cip-prefold-header-main-cover")},
							},
							b: {
								text: {element: element.find(".cip-prefold-header-main-b .cip-prefold-header-main-text")},
								cover: {element: element.find(".cip-prefold-header-main-b .cip-prefold-header-main-cover")},
							},
							c: {
								text: {element: element.find(".cip-prefold-header-main-c .cip-prefold-header-main-text")},
								cover: {element: element.find(".cip-prefold-header-main-c .cip-prefold-header-main-cover")},
							}
						},
						sub: {
							message: {
 								text: {element: element.find(".cip-prefold-header-sub-message-text")},
								cover: {element: element.find(".cip-prefold-header-sub-message-cover")},
							},
							link: {
 								text: {element: element.find(".cip-prefold-header-sub-link-text")},
								cover: {element: element.find(".cip-prefold-header-sub-link-cover")},
							}
						}
					},
					graphic: {
						media: {
							video: {element: element.find(".cip-prefold-graphic-content-media-video")},
							cover: {element: element.find(".cip-prefold-graphic-content-media-cover")},
						},
						shadow: {
							fill: {element: element.find(".cip-prefold-graphic-content-shadow-fill")},
							cover: {element: element.find(".cip-prefold-graphic-content-shadow-cover")},
						},
					}
				});

				// Lines
				entryTimeline.from(component.leftLine.element, 1.4, {
					scaleY: 0,
					transformOrigin: "50% 0%",
					ease: CustomEase.get("cipInOut")
				}, 1.3);

				entryTimeline.from(component.rightLine.element, 1.8, {
					scaleY: 0,
					transformOrigin: "50% 0%",
					ease: Power2.easeInOut
				}, 1.8);

				component.leftLine.element.removeClass("cip-hidden");

				// Header
				cipAndSlide(entryTimeline, {
					contentElement: component.header.main.a.text.element,
					coverElement: component.header.main.a.cover.element,
					duration: 1,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.header.main.b.text.element,
					coverElement: component.header.main.b.cover.element,
					duration: 1.2,
					delay: .2
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.header.main.c.text.element,
					coverElement: component.header.main.c.cover.element,
					duration: 1.4,
					delay: .4
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.header.sub.message.text.element,
					coverElement: component.header.sub.message.cover.element,
					duration: 1.1,
					delay: .9
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.header.sub.link.text.element,
					coverElement: component.header.sub.link.cover.element,
					duration: .8,
					direction: "y",
					delay: 1.8
				});

				// Graphic
				cipAndSlide(entryTimeline, {
					contentElement: component.graphic.media.video.element,
					coverElement: component.graphic.media.cover.element,
					duration: 1.6,
					delay: 1.1,
					onShow: function() {
						component.graphic.media.video.element[0].play();
					}
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.graphic.shadow.fill.element,
					coverElement: component.graphic.shadow.cover.element,
					duration: 1.2,
					offset: 0,
					delay: 1.6,
				});

				// Logo

				entryTimeline.from(component.logo.c.element, .28, {
					drawSVG: 0,
					ease: CustomEase.get("cipInOut")
				}, logoStart);

				entryTimeline.from(component.logo.r[1].element, .28, {
					drawSVG: 0,
					ease: Power2.easeIn
				}, logoStart + .18);

				entryTimeline.from(component.logo.r[2].element, .2, {
					drawSVG: 0,
					ease: Power2.easeOut
				}, logoStart + .5);

				entryTimeline.from(component.logo.u.element, .34, {
					drawSVG: 0,
					ease: CustomEase.get("cipInOut")
				}, logoStart + .6);


				cipAndSlide(entryTimeline, {
					contentElement: component.logo.x[1].fill.element,
					coverElement: component.logo.x[1].cover.element,
					direction: "y",
					duration: .52,
					offset: 0,
					delay: logoStart + .84,
					hideCover: true,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.logo.x[2].fill.element,
					coverElement: component.logo.x[2].cover.element,
					direction: "y",
					duration: .52,
					offset: 0,
					delay: logoStart + 1.24,
					hideCover: true,
				});

				component.logo.element.removeClass("cip-hidden");

				component.timelines.push({
					timeline: entryTimeline,
					trigger: {
						start: 0,
						end: function() {
							return 48 + 11.5 * screen.vw;
						},
					}
				});
			},
			reset: function(component, element) {
				component.graphic.media.video.element[0].pause();

				component.graphic.media.video.element[0].currentTime = 0;
			}
		};

		components.sections.about = {
			initialize: function(component, element) {
				var entryTimeline = new TimelineMax({paused: true}),
					chartTimeline = new TimelineMax({paused: true}),
					chartDuration = 1.8,
					holderObject = {};

				_.assign(component, {
					chart: {
						element: element.find(".cip-about-chart"),
						circle: {
							element: element.find(".cip-about-chart-circle"),
							black: {element: element.find(".cip-about-chart-circle-black")},
							red: {element: element.find(".cip-about-chart-circle-red")},
						},
						label: {
							a: {
								text: {element: element.find(".cip-about-chart-label-a-text")},
								cover: {element: element.find(".cip-about-chart-label-a-cover")},
							},
							b: {
								text: {element: element.find(".cip-about-chart-label-b-text")},
								cover: {element: element.find(".cip-about-chart-label-b-cover")},
							}
						},
						title: {
							text: {element: element.find(".cip-about-chart-content-title-text")},
							cover: {element: element.find(".cip-about-chart-content-title-cover")},
						},
						message: {
							text: {element: element.find(".cip-about-chart-content-message-text")},
							cover: {element: element.find(".cip-about-chart-content-message-cover")},
						},
						source: {
							text: {element: element.find(".cip-about-chart-content-source-text")},
							cover: {element: element.find(".cip-about-chart-content-source-cover")},
						}
					},
					bear: {
						element: element.find(".cip-about-message-title-bear"),
						graphic: {element: element.find(".cip-about-message-title-bear-graphic")},
						cover: {element: element.find(".cip-about-message-title-bear-cover")},
					}
				});

				chartTimeline.fromTo(component.chart.circle.black.element, chartDuration * .70588, {
					drawSVG: "12.5% 12.5%",
				}, {
					drawSVG: "12.5% 62.5%",
					ease: Linear.easeNone
				});

				chartTimeline.fromTo(component.chart.circle.red.element, chartDuration * .17647, {
					drawSVG: "62.5% 62.5%",
				}, {
					drawSVG: "62.5% 87.5%",
					ease: Linear.easeNone
				});

				entryTimeline.add(chartTimeline.tweenFromTo(0, chartTimeline.duration(), {
					ease: CustomEase.get("cipInOut")
				}), 0)

				entryTimeline.fromTo(component.chart.circle.element, chartDuration, {
					rotation: -480
				}, {
					rotation: 0,
					ease: CustomEase.get("cipInOut")
				}, 0);

				cipAndSlide(entryTimeline, {
					contentElement: component.chart.label.a.text.element,
					coverElement: component.chart.label.a.cover.element,
					duration: 1.1,
					offset: -12,
					delay: 1.35
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.chart.label.b.text.element,
					coverElement: component.chart.label.b.cover.element,
					duration: 1.1,
					offset: -12,
					delay: 1.5
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.chart.title.text.element,
					coverElement: component.chart.title.cover.element,
					duration: 1.2,
					delay: .5
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.chart.message.text.element,
					coverElement: component.chart.message.cover.element,
					duration: 1.4,
					delay: .7
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.chart.source.text.element,
					coverElement: component.chart.source.cover.element,
					duration: 1.4,
					offset: -12,
					delay: .8
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.bear.graphic.element,
					coverElement: component.bear.cover.element,
					duration: 1,
					direction: "y",
					offset: 20,
					delay: 1.8
				});

				component.chart.element.removeClass("cip-hidden");

				component.bear.element.removeClass("cip-hidden");

				component.timelines.push({
					timeline: entryTimeline,
					trigger: {
						start: function() {return 84 + 12 * screen.vw;},
						end: function() {return 84 + 8 * screen.vw;},
					}
				});
			},
		};

		components.sections.team = {
			initialize: function(component, element) {
				var headerTimeline = new TimelineMax({paused: true}),
					galleryTimeline = new TimelineMax({paused: true});

				_.assign(component, {
					header: {
						leftLine: {element: element.find(".cip-team-header-line-left")},
						rightLine: {element: element.find(".cip-team-header-line-right")},
					},
					portraitItems: {
						element: element.find(".cip-team-portrait-item")
					}
				});

				headerTimeline.from(component.header.leftLine.element, 2.2, {
					drawSVG: 0,
					ease: Power3.easeOut
				}, 0);

				headerTimeline.from(component.header.rightLine.element, 2.2, {
					drawSVG: 0,
					ease: Power3.easeOut
				}, 0);

				component.portraitItems.element.each(function(index) {
					var element = $(this),
						coverElement = element.find(".cip-team-portrait-item-visual-cover"),
						imageElement = element.find(".cip-team-portrait-item-visual-image");

					cipAndSlide(galleryTimeline, {
						contentElement: imageElement,
						coverElement: coverElement,
						duration: .8,
						// direction: "y",
						// offset: (index % 2 == 1) ? 20 : -20,
						// reverse: (index % 2 == 1),
						delay: .1 + .12 * index
					});
				});

				// component.logo.element.removeClass("cip-hidden");

				component.timelines.push({
					timeline: headerTimeline,
					trigger: {
						start: function() {return 10.75 * screen.vw;},
						end: function() {return 14 * screen.vw;},
					}
				});

				component.timelines.push({
					timeline: galleryTimeline,
					trigger: {
						start: function() {return 15 * screen.vw;},
						end: function() {return 4.5 * screen.vw;},
					}
				});
			},
		};

		components.sections.consumer = {
			initialize: function(component, element) {
				var entryTimeline = new TimelineMax({paused: true});

				_.assign(component, {
					messageB: {
						visual: {element: element.find(".cip-consumer-message-b-visual")},
						cover: {element: element.find(".cip-consumer-message-b-content-cover")}
					},
					messageC: {
						visual: {element: element.find(".cip-consumer-message-c-visual")},
						cover: {element: element.find(".cip-consumer-message-c-content-cover")}
					}
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.messageB.visual.element,
					coverElement: component.messageB.cover.element,
					direction: "y",
					duration: 1,
					offset: 20,
					delay: 0,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.messageC.visual.element,
					coverElement: component.messageC.cover.element,
					direction: "y",
					duration: 1,
					offset: 20,
					delay: .32,
				});

				component.timelines.push({
					timeline: entryTimeline,
					trigger: {
						start: function() {return 20 * screen.vw;},
						end: function() {return 10 * screen.vw;},
					}
				});
			},
		};

		components.sections.producer = {
			initialize: function(component, element) {
				var timelineA = new TimelineMax({paused: true}),
					timelineB = new TimelineMax({paused: true});

				_.assign(component, {
					visualA: {
						content: {element: element.find(".cip-producer-visual-a-content")},
						cover: {element: element.find(".cip-producer-visual-a-cover")},
						bgBox: {element: element.find(".cip-producer-visual-a-bg-box")},
					},
					visualB: {
						content: {element: element.find(".cip-producer-visual-b-content")},
						cover: {element: element.find(".cip-producer-visual-b-cover")},
					},
				});

				cipAndSlide(timelineA, {
					contentElement: component.visualA.content.element,
					coverElement: component.visualA.cover.element,
					direction: "x",
					duration: 1,
					offset: 20,
					delay: 0,
				});

				timelineA.fromTo(component.visualA.bgBox.element, .8, {
					xPercent: 100,
				}, {
					xPercent: 0,
					ease: CustomEase.get("cipInOut")
				}, .2);

				cipAndSlide(timelineB, {
					contentElement: component.visualB.content.element,
					coverElement: component.visualB.cover.element,
					direction: "x",
					duration: 1,
					reverse: true,
					offset: -20,
					hideCover: true,
				});

				component.timelines.push({
					timeline: timelineA,
					trigger: {
						start: function() {return 8.5 * screen.vw;},
						end: function() {return 40.5 * screen.vw;},
					}
				});

				component.timelines.push({
					timeline: timelineB,
					trigger: {
						start: function() {return 36.5 * screen.vw;},
						end: function() {return 8.5 * screen.vw;},
					}
				});

				// component.timelines.push({
				// 	timeline: headerTimeline,
				// 	trigger: {
				// 		start: function() {return 10.75 * screen.vw;},
				// 		end: function() {return 14 * screen.vw;},
				// 	}
				// });

				// component.timelines.push({
				// 	timeline: galleryTimeline,
				// 	trigger: {
				// 		start: function() {return 15 * screen.vw;},
				// 		end: function() {return 4.5 * screen.vw;},
				// 	}
				// });
			},
		};

		components.sections.quote = {
			initialize: function(component, element) {
				var entryTimeline = new TimelineMax({paused: true});

				_.assign(component, {
					box: {
						content: {element: element.find(".cip-quote-box-content")},
						text: {element: element.find(".cip-quote-box-text")},
						cover: {element: element.find(".cip-quote-box-cover")},
						quoteLeft: {
							content: {element: element.find(".cip-quote-box-quote-left-graphic")},
							cover: {element: element.find(".cip-quote-box-quote-left-cover")}
						},
						quoteRight: {
							content: {element: element.find(".cip-quote-box-quote-right-graphic")},
							cover: {element: element.find(".cip-quote-box-quote-right-cover")}
						}
					}
				});


				cipAndSlide(entryTimeline, {
					contentElement: component.box.content.element,
					coverElement: component.box.cover.element,
					direction: "y",
					duration: .8,
					offset: 36,
					offsetElement: component.box.text.element,
					delay: 0,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.box.quoteLeft.content.element,
					coverElement: component.box.quoteLeft.cover.element,
					direction: "x",
					duration: .8,
					delay: .4,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.box.quoteRight.content.element,
					coverElement: component.box.quoteRight.cover.element,
					direction: "x",
					duration: .8,
					delay: .4,
				});

				component.timelines.push({
					timeline: entryTimeline,
					trigger: {
						start: function() {return 16.5 * screen.vw;},
						end: function() {return 2.5 * screen.vw;},
					}
				});
			},
		};

		components.sections.features = {
			initialize: function(component, element) {
				var entryTimeline = new TimelineMax({paused: true});

				_.assign(component, {
					items: {
						header: {element: element.find(".cip-features-item-header")}
					}
				});

				component.items.header.element.each(function(index) {
					var element = $(this),
						contentElement = element.find(".cip-features-item-header-content"),
						coverElement = element.find(".cip-features-item-header-cover");

					cipAndSlide(entryTimeline, {
						contentElement: contentElement,
						coverElement: coverElement,
						duration: .8,
						direction: "y",
						delay: 0 + .14 * index
					});
				});

				component.timelines.push({
					timeline: entryTimeline,
					trigger: {
						start: function() {return 6 * screen.vw;},
						end: function() {return 3* screen.vw;},
					}
				});
			},
		};

		components.sections.cta = {
			initialize: function(component, element) {
				var entryTimeline = new TimelineMax({paused: true}),
					logoStart = 0;

				_.assign(component, {
					logo: {
						element: element.find(".cip-cta-logo"),
						c: {element: element.find(".cip-cta-logo-c")},
						r: {
							1: {element: element.find(".cip-cta-logo-r-1")},
							2: {element: element.find(".cip-cta-logo-r-2")},
						},
						u: {element: element.find(".cip-cta-logo-u")},
						x: {
							1: {
								fill: {element: element.find(".cip-cta-logo-x-1-fill")},
								cover: {element: element.find(".cip-cta-logo-x-1-cover")},
							},
							2: {
								fill: {element: element.find(".cip-cta-logo-x-2-fill")},
								cover: {element: element.find(".cip-cta-logo-x-2-cover")},
							},
						},
					},
					tryButton: {
						text: {element: element.find(".cip-cta-try-button-text")},
						cover: {element: element.find(".cip-cta-try-button-cover")},
					},
					talkButton: {
						text: {element: element.find(".cip-cta-talk-button-text")},
						cover: {element: element.find(".cip-cta-talk-button-cover")},
					}
				});

				entryTimeline.from(component.logo.c.element, .62, {
					drawSVG: 0,
					ease: CustomEase.get("cipInOut")
				}, logoStart);

				entryTimeline.from(component.logo.r[1].element, .62, {
					drawSVG: 0,
					ease: Power2.easeIn
				}, logoStart + .14);

				entryTimeline.from(component.logo.r[2].element, .5, {
					drawSVG: 0,
					ease: Power2.easeOut
				}, logoStart + .66);

				entryTimeline.from(component.logo.u.element, .74, {
					drawSVG: 0,
					ease: CustomEase.get("cipInOut")
				}, logoStart + .28);


				cipAndSlide(entryTimeline, {
					contentElement: component.logo.x[1].fill.element,
					coverElement: component.logo.x[1].cover.element,
					direction: "y",
					duration: .8,
					offset: 0,
					delay: logoStart + .42,
					hideCover: true,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.logo.x[2].fill.element,
					coverElement: component.logo.x[2].cover.element,
					direction: "y",
					duration: .8,
					offset: 0,
					delay: logoStart + .82,
					hideCover: true,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.tryButton.text.element,
					coverElement: component.tryButton.cover.element,
					direction: "x",
					duration: 1,
					reverse: true,
					offset: -20,
					delay: logoStart + .62,
					hideCover: true,
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.talkButton.text.element,
					coverElement: component.talkButton.cover.element,
					direction: "x",
					duration: 1,
					offset: 20,
					delay: logoStart + .62,
					hideCover: true,
				});

				component.timelines.push({
					timeline: entryTimeline,
					trigger: {
						start: function() {return 10 * screen.vw;},
						end: function() {return 6 * screen.vw;},
					}
				});

				// component.timelines.push({
				// 	timeline: galleryTimeline,
				// 	trigger: {
				// 		start: function() {return 15 * screen.vw;},
				// 		end: function() {return 4.5 * screen.vw;},
				// 	}
				// });
			},
		};

		components.sections.footer = {
			initialize: function(component, element) {
				var entryTimeline = new TimelineMax({paused: true});
			
				_.assign(component, {
					whitepaper: {
						content: {element: component.element.find(".cip-footer-whitepaper-content")},
						cover: {element: component.element.find(".cip-footer-whitepaper-cover")},
					}
				});

				cipAndSlide(entryTimeline, {
					contentElement: component.whitepaper.content.element,
					coverElement: component.whitepaper.cover.element,
					direction: "y",
					duration: 1.2,
					offset: 20,
					reverse: true,
					delay: 0,
					hideCover: true,
				});

				component.timelines.push({
					timeline: entryTimeline,
					trigger: {
						start: function() {return 3 * screen.vw;},
						end: function() {return 0 * screen.vw;},
					}
				});
			},
		};

		for (var idx = 0, len = config.sectionList.length; idx < len; idx++) {
			setupSection(config.sectionList[idx], idx);
		}

		updateSectionPositions();

		updateSectionVisibility();

		observers.resize.push(function() {
			updateSectionPositions();

			updateSectionVisibility();
		});

		observers.scroll.push(updateSectionVisibility);

		function setupSection(sectionName, index) {
			var section = components.sections[sectionName];

			section.timelines = [];

			section.element = components.main.element.find(".cip-" + sectionName);

			section.initialize(section, section.element);
		}

		function updateSectionPositions() {
			var section;

			for (var idx = 0, len = config.sectionList.length; idx < len; idx++) {
				section = components.sections[config.sectionList[idx]];

				if (idx == 0) {
					section.position = {
						start: 0
					};
				}
				else {
					section.position = {
						start: section.element.offset().top,
					};

					components.sections[config.sectionList[idx - 1]].position.end = section.position.start;

					if (idx == len - 1) {
						section.position.end = $(document).height();
					}
				}
			}
		}

		function updateSectionVisibility() {
			var section,
				shouldBeVisible;

			for (var idx = 0, len = config.sectionList.length; idx < len; idx++) {
				section = components.sections[config.sectionList[idx]];

				shouldBeVisible = (
					(section.position.start >= screen.scrollPosition && section.position.start < screen.scrollPosition + screen.height) ||
					(section.position.end > screen.scrollPosition && section.position.start <= screen.scrollPosition)
				);


				if (section.visible && !shouldBeVisible) {
					section.visible = false;

					delete section.position.offset;

					if (section.reset) section.reset(section, section.element);

					resetTimelines(section);
				}
				else if (!section.visible && shouldBeVisible) {
					section.visible = true;
				}

				if (section.visible) {
					section.position.onset = screen.scrollPosition + screen.height - section.position.start;

					section.position.endset = section.position.end - screen.scrollPosition;

					evaluateTimelines(section);
				}
			}
		}

		function resetTimelines(section) {
			var timelineConfiguration;

			for (var idx = 0, len = section.timelines.length; idx < len; idx++) {
				timelineConfiguration = section.timelines[idx];

				if (timelineConfiguration.played) {
					timelineConfiguration.played = false;

					timelineConfiguration.timeline.pause(0);
				}
			}
		}

		function evaluateTimelines(section) {
			var timelineConfiguration,
				triggerStart,
				triggerEnd;

			for (var idx = 0, len = section.timelines.length; idx < len; idx++) {
				timelineConfiguration = section.timelines[idx];

				if (!timelineConfiguration.played) {
					triggerStart = timelineConfiguration.trigger.start || 0;

					triggerEnd = timelineConfiguration.trigger.end || 0;

					if (_.isFunction(triggerStart)) triggerStart = triggerStart();

					if (_.isFunction(triggerEnd)) triggerEnd = triggerEnd();

					if (section.position.onset >= triggerStart && section.position.endset >= triggerEnd) {
						timelineConfiguration.played = true;

						timelineConfiguration.timeline.play();
					}
				} 
			}
		}
	}

	function notifyObservers(event, data) {
		var specifiedObservers = observers[event];

		if (!specifiedObservers) return;

		for (var idx = 0, len = specifiedObservers.length; idx < len; idx++) {
			specifiedObservers[idx](data);
		}
	}

	function mapPropertyMultiply(a, b, modifier) {
		var obj = {};

		obj[a * modifier] = b * modifier;

		return obj;
	}

	function cipAndSlide(timeline, parameters) {
		var parameters = _.assign(_.clone(config.slideDefaults), parameters),
			tweenFromParameters = {},
			tweenToParameters = {};

		timeline.fromTo(parameters.contentElement, parameters.duration, {
			visibility: "hidden",
		}, {
			visibility: "visible",
			onStart: parameters.onShow
		}, parameters.delay + parameters.duration * .5);

		tweenFromParameters[parameters.direction + "Percent"] = (parameters.reverse) ? 100 : -100;
		
		tweenFromParameters[parameters.direction] = (parameters.reverse) ? 1 : -1;

		tweenToParameters[parameters.direction + "Percent"] = (parameters.reverse) ? -100 : 100;

		tweenToParameters[parameters.direction] = (parameters.reverse) ? -1 : 1;

		tweenToParameters.ease = CustomEase.get("cipInOut");

		timeline.fromTo(parameters.coverElement, parameters.duration, tweenFromParameters, tweenToParameters, parameters.delay);

		if (parameters.offset) {
			if (parameters.direction == "x") {
				timeline.from(parameters.offsetElement || parameters.contentElement, parameters.duration, {
					x: parameters.offset,
					ease: CustomEase.get("cipInOut")
				}, parameters.delay);
			}
			else if (parameters.direction == "y") {
				timeline.from(parameters.offsetElement || parameters.contentElement, parameters.duration, {
					y: parameters.offset,
					ease: CustomEase.get("cipInOut")
				}, parameters.delay);
			}
		}

		parameters.coverElement.removeClass("cip-hidden");
		
		parameters.contentElement.removeClass("cip-hidden");
	}
});