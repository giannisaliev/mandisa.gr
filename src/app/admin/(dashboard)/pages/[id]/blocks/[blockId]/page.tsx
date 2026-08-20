import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  BLOCK_LABELS,
  buttonsToLines,
  paragraphsToText,
  videosToLines,
  tabsToText,
  type HeroData,
  type HeadingData,
  type RichTextData,
  type ImageWithTextData,
  type ButtonRowData,
  type ImageCarouselData,
  type VideoGridData,
  type TabsVideoData,
  type MapLocationData,
  type ContactFormData,
  type SpacerData,
} from "@/lib/blocks";
import {
  updateHeroBlock,
  updateHeadingBlock,
  updateRichTextBlock,
  updateImageWithTextBlock,
  updateButtonRowBlock,
  updateImageCarouselBlock,
  updateVideoGridBlock,
  updateTabsVideoBlock,
  updateMapLocationBlock,
  updateContactFormBlock,
  updateSpacerBlock,
} from "@/lib/actions/blocks";
import { Field, inputClass, textareaClass } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

type Params = { id: string; blockId: string };

export default async function EditBlockPage({ params }: { params: Promise<Params> }) {
  const { id: pageId, blockId } = await params;
  const block = await prisma.block.findUnique({ where: { id: blockId } });
  if (!block || block.pageId !== pageId) notFound();

  const back = (
    <Link href={`/admin/pages/${pageId}`} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
      <ArrowLeft size={15} />
      Πίσω στη σελίδα
    </Link>
  );

  const title = (
    <h1 className="mt-2 text-2xl font-semibold">
      Επεξεργασία: {BLOCK_LABELS[block.type as keyof typeof BLOCK_LABELS] ?? block.type}
    </h1>
  );

  const wrap = (form: React.ReactNode) => (
    <div className="max-w-2xl space-y-6">
      <div>
        {back}
        {title}
      </div>
      {form}
    </div>
  );

  switch (block.type) {
    case "hero": {
      const data = JSON.parse(block.data) as HeroData;
      const action = updateHeroBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Τίτλος">
            <input name="heading" defaultValue={data.heading} className={inputClass} />
          </Field>
          <Field label="Υπότιτλος">
            <input name="subheading" defaultValue={data.subheading} className={inputClass} />
          </Field>
          <Field label="Βίντεο φόντου (URL)" hint="π.χ. /media/video.mp4 — προτεραιότητα έναντι εικόνας.">
            <input name="videoUrl" defaultValue={data.videoUrl} className={inputClass} />
          </Field>
          <Field label="Εικόνα φόντου (URL)" hint="Χρησιμοποιείται αν δεν υπάρχει βίντεο.">
            <input name="imageUrl" defaultValue={data.imageUrl} className={inputClass} />
          </Field>
          <Field label="Κουμπιά" hint='Μία γραμμή ανά κουμπί: "Κείμενο | /διεύθυνση"'>
            <textarea name="buttons" defaultValue={buttonsToLines(data.buttons)} rows={3} className={textareaClass} />
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "heading": {
      const data = JSON.parse(block.data) as HeadingData;
      const action = updateHeadingBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Κείμενο">
            <input name="text" defaultValue={data.text} required className={inputClass} />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Μέγεθος">
              <select name="level" defaultValue={data.level} className={inputClass}>
                <option value="h1">H1 (μέγιστο)</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4 (ελάχιστο)</option>
              </select>
            </Field>
            <Field label="Στοίχιση">
              <select name="align" defaultValue={data.align} className={inputClass}>
                <option value="left">Αριστερά</option>
                <option value="center">Κέντρο</option>
                <option value="right">Δεξιά</option>
              </select>
            </Field>
            <Field label="Στυλ">
              <select name="variant" defaultValue={data.variant} className={inputClass}>
                <option value="display">Διακοσμητικό</option>
                <option value="normal">Απλό</option>
              </select>
            </Field>
          </div>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "richtext": {
      const data = JSON.parse(block.data) as RichTextData;
      const action = updateRichTextBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Παράγραφοι" hint="Αφήστε μία κενή γραμμή ανάμεσα σε κάθε παράγραφο.">
            <textarea name="paragraphs" defaultValue={paragraphsToText(data.paragraphs)} rows={12} className={textareaClass} />
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "imageWithText": {
      const data = JSON.parse(block.data) as ImageWithTextData;
      const action = updateImageWithTextBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Εικόνα (URL)">
            <input name="imageUrl" defaultValue={data.imageUrl} className={inputClass} />
          </Field>
          <Field label="Εναλλακτικό κείμενο εικόνας (alt)">
            <input name="imageAlt" defaultValue={data.imageAlt} className={inputClass} />
          </Field>
          <Field label="Θέση εικόνας">
            <select name="imagePosition" defaultValue={data.imagePosition} className={inputClass}>
              <option value="left">Αριστερά</option>
              <option value="right">Δεξιά</option>
            </select>
          </Field>
          <Field label="Τίτλος" hint="Προαιρετικό">
            <input name="heading" defaultValue={data.heading} className={inputClass} />
          </Field>
          <Field label="Παράγραφοι" hint="Αφήστε μία κενή γραμμή ανάμεσα σε κάθε παράγραφο.">
            <textarea name="paragraphs" defaultValue={paragraphsToText(data.paragraphs)} rows={8} className={textareaClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Κουμπί — κείμενο" hint="Αφήστε κενό αν δεν θέλετε κουμπί.">
              <input name="buttonLabel" defaultValue={data.button?.label ?? ""} className={inputClass} />
            </Field>
            <Field label="Κουμπί — διεύθυνση">
              <input name="buttonHref" defaultValue={data.button?.href ?? ""} className={inputClass} />
            </Field>
          </div>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "buttonRow": {
      const data = JSON.parse(block.data) as ButtonRowData;
      const action = updateButtonRowBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Κουμπιά" hint='Μία γραμμή ανά κουμπί: "Κείμενο | /διεύθυνση"'>
            <textarea name="buttons" defaultValue={buttonsToLines(data.buttons)} rows={4} className={textareaClass} />
          </Field>
          <Field label="Στοίχιση">
            <select name="align" defaultValue={data.align} className={inputClass}>
              <option value="left">Αριστερά</option>
              <option value="center">Κέντρο</option>
              <option value="right">Δεξιά</option>
            </select>
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "imageCarousel": {
      const data = JSON.parse(block.data) as ImageCarouselData;
      const action = updateImageCarouselBlock.bind(null, pageId, blockId);
      const lines = data.images.map((i) => `${i.url} | ${i.alt}`).join("\n");
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Εικόνες" hint='Μία γραμμή ανά εικόνα: "/media/photo.jpg | Περιγραφή". Δείτε τη Βιβλιοθήκη Πολυμέσων για διαθέσιμα URLs.'>
            <textarea name="images" defaultValue={lines} rows={14} className={textareaClass} />
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "videoGrid": {
      const data = JSON.parse(block.data) as VideoGridData;
      const action = updateVideoGridBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Βίντεο" hint='Μία γραμμή ανά βίντεο: "Τίτλος | YouTube URL ή ID"'>
            <textarea name="items" defaultValue={videosToLines(data.items)} rows={12} className={textareaClass} />
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "tabsVideo": {
      const data = JSON.parse(block.data) as TabsVideoData;
      const action = updateTabsVideoBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field
            label="Καρτέλες"
            hint='Κάθε καρτέλα: 1η γραμμή = τίτλος, 2η γραμμή = YouTube URL, μετά οι παράγραφοι. Χωρίστε τις καρτέλες με μία γραμμή "---".'
          >
            <textarea name="items" defaultValue={tabsToText(data.items)} rows={18} className={textareaClass} />
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "mapLocation": {
      const data = JSON.parse(block.data) as MapLocationData;
      const action = updateMapLocationBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Τίτλος">
            <input name="heading" defaultValue={data.heading} className={inputClass} />
          </Field>
          <Field label="Διεύθυνση">
            <input name="address" defaultValue={data.address} className={inputClass} />
          </Field>
          <Field label="Αναζήτηση χάρτη" hint="Το κείμενο αναζήτησης Google Maps (συνήθως το όνομα ή η διεύθυνση).">
            <input name="mapQuery" defaultValue={data.mapQuery} className={inputClass} />
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "contactForm": {
      const data = JSON.parse(block.data) as ContactFormData;
      const action = updateContactFormBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Τίτλος">
            <input name="heading" defaultValue={data.heading} className={inputClass} />
          </Field>
          <Field label="Σημείωση" hint='π.χ. "SMS | VIBER | WHATSAPP"'>
            <input name="note" defaultValue={data.note} className={inputClass} />
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    case "spacer": {
      const data = JSON.parse(block.data) as SpacerData;
      const action = updateSpacerBlock.bind(null, pageId, blockId);
      return wrap(
        <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <Field label="Μέγεθος">
            <select name="size" defaultValue={data.size} className={inputClass}>
              <option value="sm">Μικρό</option>
              <option value="md">Μεσαίο</option>
              <option value="lg">Μεγάλο</option>
            </select>
          </Field>
          <SubmitButton>Αποθήκευση</SubmitButton>
        </form>
      );
    }

    default:
      notFound();
  }
}
