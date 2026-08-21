import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type {
  HeroData,
  HeadingData,
  RichTextData,
  ImageWithTextData,
  ButtonRowData,
  ImageCarouselData,
  VideoGridData,
  TabsVideoData,
  MapLocationData,
  ContactFormData,
} from "../src/lib/blocks";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function img(filename: string) {
  return `/media/${filename}`;
}

type BlockInput = { type: string; data: unknown };

function b(type: string, data: unknown): BlockInput {
  return { type, data };
}

async function upsertPage(input: {
  slug: string;
  title: string;
  navLabel?: string;
  metaDescription?: string;
  isHome?: boolean;
  blocks: BlockInput[];
}) {
  const page = await prisma.page.upsert({
    where: { slug: input.slug },
    update: {
      title: input.title,
      navLabel: input.navLabel,
      metaDescription: input.metaDescription,
      isHome: input.isHome ?? false,
    },
    create: {
      slug: input.slug,
      title: input.title,
      navLabel: input.navLabel,
      metaDescription: input.metaDescription,
      isHome: input.isHome ?? false,
    },
  });

  await prisma.block.deleteMany({ where: { pageId: page.id } });
  await prisma.block.createMany({
    data: input.blocks.map((block, i) => ({
      pageId: page.id,
      type: block.type,
      order: i,
      data: JSON.stringify(block.data),
    })),
  });

  return page;
}

async function main() {
  // ---- Settings -----------------------------------------------------
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Eva Mandisa",
      tagline: "Χορεύτρια Οριενταλ",
      logoUrl: img("eva-logo-white.png"),
      contactNote: "SMS | VIBER | WHATSAPP",
    },
  });

  // ---- Pages ----------------------------------------------------------
  const home = await upsertPage({
    slug: "home",
    title: "Eva Mandisa | Χορεύτρια Οριενταλ",
    isHome: true,
    metaDescription:
      "Εύα Μαντίσα — διεθνώς αναγνωρισμένη χορεύτρια Oriental, δασκάλα και κριτής σε εγχώριες και παγκόσμιες διοργανώσεις.",
    blocks: [
      b("hero", {
        heading: "Eva Mandisa",
        subheading: "Χορεύτρια Οριενταλ",
        videoUrl: img("eva-mandisa-promo.mp4"),
        imageUrl: "",
        buttons: [],
      } satisfies HeroData),
      b("heading", {
        text: "Καλώς ήρθατε!",
        level: "h2",
        align: "center",
        variant: "display",
      } satisfies HeadingData),
      b("richtext", {
        paragraphs: [
          "Είμαι η Εύα Μαντίσα, διεθνώς αναγνωρισμένη χορεύτρια Oriental, καταξιωμένη δασκάλα Ανατολίτικου Χορού και κριτής σε εγχώριες και παγκόσμιες διοργανώσεις.",
          "Με πολυετή εμπειρία, δημιουργώ παραστάσεις υψηλής αισθητικής για γάμους, γενέθλια, εταιρικές εκδηλώσεις, πολυτελή ξενοδοχεία και exclusive events στην Ελλάδα και το εξωτερικό.",
          "Η πορεία μου στον χορό συνοδεύεται από πολύ μεγάλες και σημαντικές διακρίσεις σε διεθνείς διαγωνισμούς τόσο στην Ελλάδα όσο και στο εξωτερικό, αναδεικνύοντας το πάθος και την αφοσίωσή μου στην τέχνη του Oriental.",
          "Παράλληλα, διδάσκω αυθεντικό Oriental χορό, με έμφαση στην τεχνική και την έκφραση, ενώ επίσης σχεδιάζω σειρά χειροποίητων ρούχων προπόνησης που απογειώνουν τον χορό εντός και εκτός χορευτικής αίθουσας.",
          "Ανακαλύψτε τον μαγευτικό κόσμο του οριεντάλ χορού μέσα από τη δική μου ματιά, όπου ο ρυθμός, το πάθος και η δημιουργικότητα γίνονται ένα!",
        ],
      } satisfies RichTextData),
      b("buttonRow", {
        align: "center",
        buttons: [
          { label: "Μάθε περισσότερα για εμένα", href: "/viografiko" },
          { label: "Δες τις παραστάσεις μου", href: "/shows" },
        ],
      } satisfies ButtonRowData),
      b("spacer", { size: "lg" }),
    ],
  });

  const viografiko = await upsertPage({
    slug: "viografiko",
    title: "Βιογραφικό",
    metaDescription: "Το ταξίδι της Εύας Μαντίσα στον κόσμο του Oriental χορού.",
    blocks: [
      b("spacer", { size: "md" }),
      b("imageWithText", {
        imageUrl: img("viber_image_2025-02-02_21-50-05-125-300x180.jpg"),
        imageAlt: "Η Εύα Μαντίσα σε χορευτική εμφάνιση",
        heading: "",
        imagePosition: "left",
        button: null,
        paragraphs: [
          "Ο χορός για μένα είναι ένα ατελείωτο ταξίδι, γεμάτο ρυθμό, έκφραση και μαγεία. Από τα πρώτα μου βήματα στη σκηνή, αφιερώθηκα στην τέχνη του Oriental, μελετώντας σε βάθος τα διαφορετικά στυλ του bellydance δίπλα στους σπουδαιότερους δασκάλους παγκοσμίως.",
          "Αυτή η διαδρομή δεν μου χάρισε μόνο γνώσεις, αλλά με βοήθησε να εξελίξω το δικό μου, προσωπικό στυλ.",
          "Στην πορεία, ξεκίνησα να διαγωνίζομαι σε φεστιβάλ σε πολλές χώρες της Ευρώπης, όπως Ιταλία, Γαλλία, Πολωνία, Γερμανία, Κύπρο, Ελβετία κ.ά., αλλά και πέρα από αυτή, φτάνοντας μέχρι Ρωσία και Κορέα.",
          "Εκπροσώπησα την Ελλάδα σε διεθνείς διαγωνισμούς, κερδίζοντας αναρίθμητα χρυσά μετάλλια και σημαντικές διακρίσεις.",
        ],
      } satisfies ImageWithTextData),
      b("richtext", {
        paragraphs: [
          "Η αναγνώριση αυτή με οδήγησε ένα βήμα παραπέρα: από διαγωνιζόμενη, έγινα δασκάλα και κριτής, φιλοξενούμενη σε φεστιβάλ και σχολές χορού από την Ευρώπη μέχρι τη Λατινική Αμερική, από τη Σιβηρία μέχρι το Κάιρο, διδάσκοντας και μοιράζοντας το στυλ μου με χορευτές από όλο τον κόσμο.",
          "Παράλληλα, τα shows μου έχουν φιλοξενηθεί από πολλές χώρες, όπως η Ελβετία, η Ολλανδία, η Βουλγαρία, τα Σκόπια, η Σκωτία, διασκεδάζοντας τους θαμώνες με τη μαγεία του Oriental. Οι εμφανίσεις μου δεν περιορίστηκαν μόνο σε θεατρικές σκηνές και φεστιβάλ — μάλιστα, ίσως να με έχεις ήδη παρακολουθήσει σε κάποια εκπομπή, ή και στο «Ελλάδα Έχεις Ταλέντο»!",
          "Κάθε performance είναι μια ιστορία που μιλάει χωρίς λέξεις, μια εμπειρία μοναδική τόσο για εμένα όσο και για το κοινό.",
          "Είτε πρόκειται για μια εντυπωσιακή σκηνική παρουσία, ένα σεμινάριο ή μια κοινωνική εκδήλωση, ο στόχος μου είναι πάντα ο ίδιος: να μεταφέρω και να μοιραστώ την αυθεντικότητα και τη μαγεία του Oriental με το κοινό.",
          "Ανακάλυψε περισσότερα για τα shows, τα μαθήματα και τις συνεργασίες μου!",
        ],
      } satisfies RichTextData),
      b("spacer", { size: "lg" }),
    ],
  });

  const shows = await upsertPage({
    slug: "shows",
    title: "Show - Εμφανίσεις",
    metaDescription: "Oriental χορευτικά shows για γάμους, γενέθλια, εταιρικές και ιδιωτικές εκδηλώσεις.",
    blocks: [
      b("spacer", { size: "md" }),
      b("videoGrid", {
        items: [{ label: "Oriental χορός σε γάμους, γενέθλια, εκπλήξεις, εκδηλώσεις", youtubeId: "f-SwTi8AKO4" }],
      } satisfies VideoGridData),
      b("heading", { text: "Περιγραφή Show Εκδηλώσεων", level: "h3", align: "center", variant: "display" } satisfies HeadingData),
      b("richtext", {
        paragraphs: [
          "Κάθε Oriental show σχεδιάζεται με στόχο να εντυπωσιάσει και να αγγίξει το κοινό!",
          "Η εμφάνιση ξεκινά με μια θεαματική είσοδο – μπορεί να περιλαμβάνει: φτερά με LED, βεντάλιες με LED, πέπλα, δίσκο με κεριά ή ναργιλέ στο κεφάλι – και δημιουργεί από την αρχή μια ατμόσφαιρα μυσταγωγίας και ενέργειας.",
          "Στη συνέχεια, το πρόγραμμα εξελίσσεται με εναλλαγές μουσικής σε γρήγορους ρυθμούς drum solo, διάσημα αραβικά τραγούδια και χρήση χορευτικού μπαστουνιού, και ανάλογα με τον χώρο και το κοινό, μπορεί να περιλαμβάνει και διαδραστικότητα, με συμμετοχή των καλεσμένων ή των τιμώμενων προσώπων.",
          "Οι παραστάσεις έχουν διάρκεια από 15 έως 30 λεπτά, με δυνατότητα επιλογής για μία ή περισσότερες εμφανίσεις μέσα στην ίδια εκδήλωση.",
          "Όλα προσαρμόζονται στο concept σας: από ρομαντικό και elegant, μέχρι fun, party mood ή θεατρικό στοιχείο. Μπορεί να συνδυαστεί με είσοδο-έκπληξη, live μουσική, είσοδο με τούρτα γενεθλίων ή κάποιο δώρο προς το κοινό.",
          "Επικοινωνήστε μαζί μου για να σχεδιάσουμε το ιδανικό show που θα αναδείξει τη μοναδικότητα της βραδιάς σας!",
        ],
      } satisfies RichTextData),
      b("heading", { text: "Αναλαμβάνω shows για:", level: "h4", align: "center", variant: "normal" } satisfies HeadingData),
      b("tabsVideo", {
        items: [
          {
            label: "Γάμους",
            youtubeId: "jE4r0D3SJWY",
            paragraphs: [
              "Προσθέστε μια μοναδική πινελιά στον γάμο σας με ένα Oriental show που θα μαγέψει τους καλεσμένους και θα χαρίσει στην εκδήλωσή σας στιγμές γεμάτες ενέργεια και πάθος!",
              "Είτε ως έκπληξη για όλους τους παρευρισκόμενους είτε ως ένα ξεχωριστό δώρο σε κάποιο αγαπημένο πρόσωπο, το Oriental show είναι ένας εντυπωσιακός τρόπος να δώσετε ακόμα περισσότερη λάμψη στη σημαντική σας ημέρα.",
            ],
          },
          {
            label: "Γενέθλια / Γιορτές",
            youtubeId: "y4eSxLfoj88",
            paragraphs: [
              "Μια εμφάνιση χορού οριενταλ στα γενέθλια ή την γιορτή, είναι η πιο αναπάντεχη έκπληξη προς το τιμώμενο πρόσωπο και τους καλεσμένους.",
              "Ειδικά όταν αυτή έχει προσαρμοστεί με βάση την προσωπικότητα και τις προτιμήσεις του τιμώμενου προσώπου, δημιουργεί μια παρουσίαση αφιερωμένη ειδικά σε εκείνον ή εκείνη — προσθέτοντας συγκίνηση και χαμόγελα, δημιουργώντας αναμνήσεις που θα θυμούνται όλοι.",
            ],
          },
          {
            label: "Εταιρικά Events",
            youtubeId: "EH7HHXu0fX4",
            paragraphs: [
              "Ιδανικό για συλλόγους, επιχειρηματικές εκδηλώσεις, δεξιώσεις, πολυτελή δείπνα ή θεματικά parties, το Oriental show προσφέρει την ιδανική καλλιτεχνική παρέμβαση με χαρακτήρα, αισθητική και επαγγελματισμό.",
              "Η παράσταση μπορεί να προσαρμοστεί σε διεθνές κοινό και να ενταχθεί στο πρόγραμμα του event χωρίς υπερβολές, προσφέροντας ψυχαγωγία υψηλού επιπέδου.",
            ],
          },
          {
            label: "Χώρους Εκδηλώσεων",
            youtubeId: "WyjYBjC6Abo",
            paragraphs: [
              "Ιδανικό για ξενοδοχεία, εστιατόρια και χώρους εκδηλώσεων, το πρόγραμμα προσαρμόζεται απόλυτα στις ανάγκες της κάθε βραδιάς, εξασφαλίζοντας διασκέδαση, ενέργεια και ατμόσφαιρα πολυτέλειας.",
              "Το show δεν είναι απλώς μια εντυπωσιακή εμφάνιση, αλλά και ένας τρόπος να ξεσηκωθεί το κοινό και να παραμείνει στην πίστα ακόμα και μετά το τέλος του προγράμματος.",
            ],
          },
          {
            label: "Εκπλήξεις",
            youtubeId: "sW_0qGE25zY",
            paragraphs: [
              "Είτε πρόκειται για γενέθλια, ορκωμοσία, αποχαιρετιστήριο πάρτι για το στρατό, είτε για την αναχώρηση για κάποιο ταξίδι ή για άλλη χώρα, η μοναδική αυτή έκπληξη θα προσφέρει μαγεία και ζωντάνια στην εκδήλωση.",
              "Δημιουργήστε αναμνήσεις που θα μείνουν χαραγμένες για πάντα στην καρδιά του τιμώμενου προσώπου και σε όλους τους παρευρισκόμενους!",
            ],
          },
        ],
      } satisfies TabsVideoData),
      b("heading", {
        text: "Χορευτικό σόου Oriental για όπου κι όπως το φαντάζεστε!",
        level: "h4",
        align: "center",
        variant: "display",
      } satisfies HeadingData),
      b("richtext", {
        paragraphs: [
          "Είτε σχεδιάζετε έναν παραμυθένιο γάμο σε νησί, ένα φαντασμαγορικό πάρτι γενεθλίων, ένα μοναδικό bachelor party ή μια ξεχωριστή εταιρική εκδήλωση, η μαγεία του χορού Oriental μπορεί να κάνει τη στιγμή σας ακόμα πιο ξεχωριστή. Ανεξάρτητα από το αν βρίσκεστε στην Ελλάδα ή το εξωτερικό, μπορούμε να οργανώσουμε μαζί την εμφάνιση που ταιριάζει απόλυτα στη μοναδική εμπειρία που θέλετε να δημιουργήσετε.",
          "Διαθέσιμη για χορευτικές εμφανίσεις σε: Σέρρες, Θεσσαλονίκη, Χαλκιδική, Αθήνα, Μύκονο, Σαντορίνη, Κέρκυρα, Ρόδο, Κρήτη, Αλεξανδρούπολη, Καβάλα, Ιταλία, Ντουμπάι, Μαλδίβες, Παρίσι, Λονδίνο, Νέα Υόρκη… και σε πολλές ακόμα περιοχές!",
          "Όπου κι αν φαντάζεστε το δικό σας εντυπωσιακό σόου, μπορούμε να το κάνουμε πραγματικότητα! Επικοινωνήστε μαζί μου για περισσότερες λεπτομέρειες και κρατήσεις.",
        ],
      } satisfies RichTextData),
      b("buttonRow", { align: "center", buttons: [{ label: "Επικοινωνήστε μαζί μου", href: "/epikoinonia" }] } satisfies ButtonRowData),
      b("spacer", { size: "lg" }),
    ],
  });

  const axesouar = await upsertPage({
    slug: "axesouar",
    title: "Αξεσουάρ Εμφανίσεων",
    metaDescription: "Είδη εμφανίσεων και αξεσουάρ Oriental χορού: LED αξεσουάρ, πέπλα, μπαστούνια, shamadan και άλλα.",
    blocks: [
      b("spacer", { size: "md" }),
      b("videoGrid", {
        items: [
          { label: "Φούστα με φωτάκια (LED Skirt)", youtubeId: "WyjYBjC6Abo" },
          { label: "Βεντάλιες με φωτάκια (LED Fan Veils)", youtubeId: "I5XOrem9e_c" },
          { label: "Δίσκος με κεριά (Candle Tray)", youtubeId: "eMzb11TUht0" },
          { label: "Φτερά & Δίσκος (Isis Wings & Candle Tray)", youtubeId: "ALPpiwYd31E" },
          { label: "Χορευτικά Μπαστούνια (Assaya)", youtubeId: "B80M11RsweY" },
          { label: "Πολυέλαιος (Shamadan)", youtubeId: "iablwDqFU_Y" },
          { label: "Shisha", youtubeId: "QDqY74pM_uo" },
          { label: "Βεντάλιες (Fan Veils)", youtubeId: "xPMmm0IXcEk" },
          { label: "Πέπλο (Veil)", youtubeId: "k-hj9PS4UEE" },
          { label: "Με Νταούλια ή/και τουμπερλέκια", youtubeId: "3awjA5Vg-tw" },
          { label: `"Iraqi Kawleeya" Style`, youtubeId: "-HW8IZ63URs" },
          { label: `"Khaleeje" Style`, youtubeId: "o0WGd66WH8o" },
        ],
      } satisfies VideoGridData),
      b("spacer", { size: "lg" }),
    ],
  });

  const mathimata = await upsertPage({
    slug: "mathimata",
    title: "Μαθήματα",
    metaDescription: "Μαθήματα Oriental χορού στη Θεσσαλονίκη και τις Σέρρες, σε σεμινάρια, φεστιβάλ και online.",
    blocks: [
      b("spacer", { size: "md" }),
      b("imageWithText", {
        imageUrl: img("viber_image_2025-02-02_21-50-05-352-300x200.jpg"),
        imageAlt: "Μάθημα Oriental χορού",
        heading: "",
        imagePosition: "right",
        button: { label: "Κλείστε Μάθημα", href: "/epikoinonia" },
        paragraphs: [
          "Είτε είστε αρχάριοι, είτε έχετε εμπειρία στον χορό, τα μαθήματά μου απευθύνονται σε κάθε επίπεδο και ηλικία! Μπορείτε να διδαχθείτε δια ζώσης σε σχολές χορού σε περιοχές στην Θεσσαλονίκη και στις Σέρρες, καθώς και σε σεμινάρια και φεστιβάλ διεθνώς, αλλά και διαδικτυακά από την άνεση του σπιτιού σας!",
          "Όποιος κι αν είναι ο τρόπος, ο στόχος είναι να μεταδώσω τις γνώσεις και την αγάπη μου για τον χορό σε όλους τους μαθητές μου! Ελάτε να γνωρίσετε την τέχνη του Oriental και να ανακαλύψετε τη δύναμη της έκφρασης μέσα από το σώμα σας!",
        ],
      } satisfies ImageWithTextData),
      b("spacer", { size: "md" }),
      b("mapLocation", {
        heading: "Σχολή Χορού Παπάζογλου",
        address: "Περικλέους 47, Εύοσμος - Θεσσαλονίκη",
        mapQuery: "Παπάζογλου Σχολή Χορού",
      } satisfies MapLocationData),
      b("mapLocation", {
        heading: "Σχολή Χορού Παπάζογλου",
        address: "Πτολεμαίων 29Β, Κέντρο - Θεσσαλονίκη",
        mapQuery: "Πτολεμαίων 29Β Θεσσαλονίκη",
      } satisfies MapLocationData),
      b("mapLocation", {
        heading: "Order Of Dance",
        address: "Παναγούλη 11, Σέρρες",
        mapQuery: "Order of dance Σέρρες",
      } satisfies MapLocationData),
      b("spacer", { size: "lg" }),
    ],
  });

  const festivalImages = [
    "viber_image_2025-03-19_15-51-35-906-213x300.jpg",
    "viber_image_2025-03-19_15-51-36-954-300x300.jpg",
    "viber_image_2025-03-19_15-51-37-814-240x300.jpg",
    "viber_image_2025-03-19_15-51-36-111-209x300.jpg",
    "viber_image_2025-03-19_15-51-36-548-300x300.jpg",
    "viber_image_2025-03-19_15-51-37-165-300x225.jpg",
    "viber_image_2025-03-19_15-51-37-378-240x300.jpg",
    "viber_image_2025-03-19_15-51-37-612-300x300.jpg",
    "viber_image_2025-03-19_15-51-38-453-212x300.jpg",
    "viber_image_2025-03-19_15-51-39-347-212x300.jpg",
    "viber_image_2025-03-19_15-51-39-543-212x300.jpg",
    "viber_image_2025-03-19_15-51-35-584-203x300.jpg",
    "viber_image_2025-03-19_15-51-38-237-212x300.jpg",
    "viber_image_2025-03-19_15-51-39-773-212x300.jpg",
    "viber_image_2025-03-19_15-51-39-972-183x300.jpg",
    "viber_image_2025-03-19_15-51-40-176-300x180.jpg",
    "viber_image_2025-03-19_15-51-36-317-300x300.jpg",
    "viber_image_2025-03-19_15-51-38-709-300x300.jpg",
    "viber_image_2025-03-19_15-51-36-752-240x300.jpg",
  ];

  const festival = await upsertPage({
    slug: "festival",
    title: "Φεστιβάλ",
    metaDescription: "Η Εύα Μαντίσα σε διεθνή φεστιβάλ Oriental χορού, ως performer, δασκάλα σεμιναρίων και κριτής.",
    blocks: [
      b("spacer", { size: "md" }),
      b("imageWithText", {
        imageUrl: img("viber_image_2025-02-02_21-50-04-874-300x200.jpg"),
        imageAlt: "Η Εύα Μαντίσα σε διεθνές φεστιβάλ Oriental χορού",
        heading: "",
        imagePosition: "left",
        button: { label: "Ζήτησε συνεργασία", href: "/epikoinonia" },
        paragraphs: [
          "Έχω προσκληθεί και έχω συμμετάσχει σε φεστιβάλ Oriental χορού σε όλο τον κόσμο – από τη Σιβηρία μέχρι την Αργεντινή, από την Κορέα μέχρι την Αίγυπτο και σε κάθε γωνιά της Ευρώπης. Στα φεστιβάλ, παρουσιάζω εντυπωσιακά σόου υψηλού επιπέδου, διδάσκω εξειδικευμένα σεμινάρια, και αναλαμβάνω τον ρόλο του κριτή σε διαγωνισμούς, προσφέροντας πολύτιμο feedback στους διαγωνιζόμενους.",
          "Ένα φεστιβάλ Oriental χορού είναι κάτι πολύ περισσότερο από μια σειρά παραστάσεων. Είναι μια συνάντηση κορυφαίων καλλιτεχνών, μια εμπειρία γνώσης και έμπνευσης, ένα γεγονός που καθορίζει την εξέλιξη της τέχνης μας. Αν θέλεις να δημιουργήσεις ένα φεστιβάλ υψηλών προδιαγραφών, αρκεί να με προσκαλέσεις για σόου, σεμινάρια, αλλά και ως κριτή σε διαγωνισμό!",
          "Επιπλέον, υπάρχει η δυνατότητα δημιουργίας και φιλοξενίας μου για σεμινάρια ή συμμετοχή μου σε διαγωνισμούς ανεξάρτητα από κάποιο φεστιβάλ, τόσο στην Ελλάδα όσο και στο εξωτερικό.",
          "Αν ετοιμάζεις κάποιο φεστιβάλ, σεμινάριο, χορευτικό event ή έχεις σχολή χορού στην οποία θα ήθελες να διδάξω, θα ήταν χαρά μου να συνεργαστούμε! Στείλε τα στοιχεία του event σου και πάμε να το απογειώσουμε!",
        ],
      } satisfies ImageWithTextData),
      b("imageCarousel", {
        images: festivalImages.map((f) => ({ url: img(f), alt: "Η Εύα Μαντίσα σε φεστιβάλ Oriental χορού" })),
      } satisfies ImageCarouselData),
      b("spacer", { size: "lg" }),
    ],
  });

  const embellyiaImages = [
    "viber_image_2025-02-12_01-21-52-557-240x300.jpg",
    "viber_image_2025-02-12_01-21-52-863-240x300.jpg",
    "viber_image_2025-02-12_01-21-52-198-240x300.jpg",
    "viber_image_2025-03-20_11-33-11-490-e1743168792748-240x300.jpg",
    "viber_image_2025-03-20_11-26-48-538-240x300.jpg",
    "viber_image_2025-03-20_11-26-49-183-240x300.jpg",
    "viber_image_2025-03-20_11-26-47-669-240x300.jpg",
    "viber_image_2025-03-20_11-26-48-121-240x300.jpg",
  ];

  const embellyia = await upsertPage({
    slug: "embellyia-dancewear",
    title: "EMbellyia DanceWear",
    metaDescription: "EMbellyia — χειροποίητα ρούχα χορού σχεδιασμένα για άνεση, στυλ και ελευθερία κινήσεων.",
    blocks: [
      b("spacer", { size: "md" }),
      b("imageWithText", {
        imageUrl: img("viber_image_2025-02-02_21-52-38-299-300x300.jpg"),
        imageAlt: "EMbellyia dancewear",
        heading: "EMbellyia — Άνεση και Στυλ στον Χορό",
        imagePosition: "left",
        button: null,
        paragraphs: [
          "Τα ρούχα χορού EMbellyia δημιουργήθηκαν με βάση την πολυετή μου εμπειρία στις αίθουσες χορού και σχεδιάστηκαν για να καλύπτουν τις ανάγκες των χορευτριών, προσφέροντας άνεση, στυλ και απόλυτη ελευθερία κινήσεων. Κάθε κομμάτι φτιάχνεται με υψηλής ποιότητας υλικά και ειδικό σχεδιασμό που εξασφαλίζει σταθερή εφαρμογή και κομψότητα, καθιστώντας το ιδανικό τόσο για μαθήματα όσο και για παραστάσεις.",
        ],
      } satisfies ImageWithTextData),
      b("imageCarousel", {
        images: embellyiaImages.map((f) => ({ url: img(f), alt: "EMbellyia dancewear" })),
      } satisfies ImageCarouselData),
      b("heading", {
        text: "Διεθνής Αποδοχή και Ικανοποιημένες Πελάτισσες",
        level: "h3",
        align: "center",
        variant: "display",
      } satisfies HeadingData),
      b("richtext", {
        paragraphs: [
          "Τα EMbellyia έχουν ήδη αγαπηθεί από χορεύτριες σε πολλές χώρες του κόσμου, που εκτιμούν την προσοχή στη λεπτομέρεια και τη μοναδική αίσθηση που προσφέρουν. Το πάθος μου για τον χορό αποτυπώνεται σε κάθε ρούχο, δημιουργώντας μια συλλογή που δίνει αυτοπεποίθηση και στήριξη στις χορεύτριες σε κάθε κίνηση.",
        ],
      } satisfies RichTextData),
      b("heading", {
        text: "Ανακαλύψτε την άνεση και το στυλ των EMbellyia και χαρίστε στον χορό σας την ποιότητα που του αξίζει.",
        level: "h4",
        align: "center",
        variant: "normal",
      } satisfies HeadingData),
      b("buttonRow", {
        align: "center",
        buttons: [
          {
            label: "Ακολουθήστε την EMbellyia στο Instagram",
            href: "https://www.instagram.com/embellyia_dancewear",
          },
        ],
      } satisfies ButtonRowData),
      b("spacer", { size: "lg" }),
    ],
  });

  const ekdiloseis = await upsertPage({
    slug: "ekdiloseis",
    title: "Εκδηλώσεις",
    metaDescription: "Oriental χορευτικά shows προσαρμοσμένα στη δική σας εκδήλωση — γάμοι, εταιρικά events και πολυτελείς δεξιώσεις.",
    blocks: [
      b("spacer", { size: "md" }),
      b("imageWithText", {
        imageUrl: img("viber_image_2025-02-02_21-58-03-542-300x300.jpg"),
        imageAlt: "Οργάνωση εκδηλώσεων με Oriental χορό",
        heading: "",
        imagePosition: "left",
        button: { label: "Μάθε ποιές εκδηλώσεις μπορείς να εμπλουτίσεις με Bellydance Show", href: "/shows" },
        paragraphs: [
          "Μετατρέψτε την εκδήλωσή σας σε μια αξέχαστη εμπειρία με Oriental χορευτικά shows που προσφέρουν κάτι παραπάνω! Είτε πρόκειται για ένα προσωπικό πάρτι είτε για μια πολυτελή εκδήλωση, οι παραστάσεις προσαρμόζονται στις ανάγκες σας, κάνοντας κάθε στιγμή μοναδική!",
          "Δημιουργούμε την κάθε εμφάνιση αποκλειστικά για την δική σας εκδήλωση: τα Oriental shows μπορούν να προσαρμοστούν σύμφωνα με το ύφος και το κοινό της κάθε εκδήλωσης, με προσεκτική επιλογή της μουσικής, των αξεσουάρ, της διάρκειας, ακόμα και των χρωμάτων των κοστουμιών!",
        ],
      } satisfies ImageWithTextData),
      b("buttonRow", {
        align: "center",
        buttons: [{ label: "Διάλεξε το αξεσουάρ εμφάνισης για την δική σου εκδήλωση", href: "/axesouar" }],
      } satisfies ButtonRowData),
      b("richtext", {
        paragraphs: [
          "Με γνώμωνα την εμπειρία μου και την ικανότητα να προσαρμόζω την εμφάνισή μου στις ανάγκες της κάθε εκδήλωσης, σας προσφέρω μια εμπειρία που θα αφήσει τις καλύτερες εντυπώσεις!",
          "Με πάνω από μια δεκαετία εμπειρίας και την καθοδήγηση μιας εξαιρετικής ομάδας χορευτριών, προσφέρουμε παραστάσεις ατομικές, ντουέτο ή ομαδικές που φέρνουν ζωντάνια και στυλ σε κάθε σκηνή. Επιλέξτε την «EMbellyia Dance Show» και κάντε την εκδήλωσή σας αξέχαστη.",
        ],
      } satisfies RichTextData),
      b("buttonRow", {
        align: "center",
        buttons: [{ label: "Επικοινωνήστε και κλείστε το show για τη δική σας εκδήλωση", href: "/epikoinonia" }],
      } satisfies ButtonRowData),
      b("richtext", {
        paragraphs: [
          "Αν επιθυμείτε να εμπλουτίσετε την εκδήλωσή σας χορευτικά, με προσθήκη χορού πέρα του Oriental, προσφέρεται και η δυνατότητα εύρεσης και οργάνωσης χορευτικών εμφανίσεων από πολλά είδη χορού, όπως Ζεϊμπέκικο, Ballroom, Latin, High Heels και Παραδοσιακούς Χορούς.",
          "Η «EMbellyia Dance Show» αναλαμβάνει την οργάνωση της εκδήλωσής σας, με επιλογή των καλύτερων χορευτικών ομάδων για κάθε είδος χορού, εξασφαλίζοντας πάντα την υψηλότερη ποιότητα για κάθε εκδήλωση.",
          "Επικοινωνήστε μαζί μου για να σχεδιάσουμε μαζί μια ξεχωριστή παράσταση που θα δώσει λάμψη και ξεχωριστό στυλ σε κάθε περίσταση!",
        ],
      } satisfies RichTextData),
      b("spacer", { size: "lg" }),
    ],
  });

  const epikoinonia = await upsertPage({
    slug: "epikoinonia",
    title: "Επικοινωνία",
    metaDescription: "Επικοινωνήστε με την Εύα Μαντίσα για κρατήσεις shows, μαθήματα και συνεργασίες.",
    blocks: [
      b("spacer", { size: "lg" }),
      b("contactForm", {
        heading: "Επικοινωνήστε μαζί μου",
        note: "SMS | VIBER | WHATSAPP",
      } satisfies ContactFormData),
      b("spacer", { size: "lg" }),
    ],
  });

  // ---- Menu -------------------------------------------------------------
  await prisma.menuItem.deleteMany({});

  const eventsParent = await prisma.menuItem.create({
    data: { label: "Εκδηλώσεις", order: 1, pageId: ekdiloseis.id },
  });

  await prisma.menuItem.createMany({
    data: [
      { label: "Βιογραφικό", order: 0, pageId: viografiko.id },
      { label: "Show-Εμφανίσεις", order: 0, pageId: shows.id, parentId: eventsParent.id },
      { label: "Αξεσουάρ Εμφανίσεων", order: 1, pageId: axesouar.id, parentId: eventsParent.id },
      { label: "Μαθήματα", order: 2, pageId: mathimata.id },
      { label: "Φεστιβάλ", order: 3, pageId: festival.id },
      { label: "EMbellyia DanceWear", order: 4, pageId: embellyia.id },
      { label: "Επικοινωνία", order: 5, pageId: epikoinonia.id },
    ],
  });

  void home;

  // ---- Media library ------------------------------------------------
  const mediaDir = path.join(process.cwd(), "public", "media");
  const files = readdirSync(mediaDir).filter((f) => statSync(path.join(mediaDir, f)).isFile());
  const videoExt = new Set([".mp4", ".mov", ".webm"]);

  for (const filename of files) {
    const url = img(filename);
    const existing = await prisma.mediaAsset.findFirst({ where: { url } });
    if (existing) continue;
    const ext = path.extname(filename).toLowerCase();
    await prisma.mediaAsset.create({
      data: {
        url,
        filename,
        kind: videoExt.has(ext) ? "video" : "image",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
