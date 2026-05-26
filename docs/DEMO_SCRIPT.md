# Shop Council 60-Second Demo Script

Use the fallback version if live LLM keys are not ready. The story still works.

## Demo Goal

Show that Shop Council makes Wayfair shopping feel safer, more guided, and more fun by turning a confusing furniture decision into a live expert debate.

## Recording Flow

0-8 seconds:
- Open `http://localhost:3000`.
- Say: "Buying furniture online is scary because you do not know if it is real, if it fits, or if delivery and assembly will be painful."

8-18 seconds:
- Select `Tiny Apartment Sofa`.
- Say: "Shop Council turns that anxiety into a five-person boardroom: style, luxury, budget, logistics, and trust."

18-30 seconds:
- Click `Run Council`.
- Let the first debate turns animate.
- Say: "The agents disagree on purpose. One wants the premium look, one defends the budget, and one checks actual dimensions."

30-42 seconds:
- Point out the Wayfair confidence check panel.
- Say: "This is where Wayfair has an advantage: dimensions, View in Room, delivery windows, assembly details, reviews, and trust signals are all decision inputs."

42-54 seconds:
- Let Review & Trust Analyst or Logistics Lead speak.
- Say: "The council directly answers the buyer's real questions: is this legit, will it fit my room, and what could go wrong?"

54-60 seconds:
- Scroll or look at final verdict.
- Say: "Then it gives a decisive recommendation with reasons, caveats, and confidence. It is shopping guidance, but with showmanship."

## Best Scenario To Record

Use `Tiny Apartment Sofa`.

Why:
- Fit anxiety is obvious.
- Dimensions and delivery matter.
- Premium vs budget conflict is easy to understand.
- Wayfair's View in Room angle makes immediate sense.

## Backup Lines

If the live model is slow:
- "The app is fallback-safe for demo reliability, so even with no model key the council still produces a complete recommendation."

If judges ask about agents:
- "We simulate the five agents in one orchestrator call for speed and reliability. The product experience is multi-agent; the implementation is intentionally lean."

If judges ask why Wayfair:
- "Wayfair already exposes the exact signals furniture shoppers need: dimensions, room visualization, delivery, assembly, reviews, photos, and trust context. Shop Council makes those signals conversational and memorable."
