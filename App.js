// App.js
// Complete single-file React app (JavaScript) that digitizes
// Life Sciences P2 November 2022 with answering, submission,
// auto-marking, per-question feedback, and results.
//
// Usage:
// - Drop this into a Create React App or Vite React project as src/App.js
// - Ensure React is installed
// - Add the style tag below to index.html or keep styles inline here (see StyleInjector)

import React, { useMemo, useState, useEffect, useCallback } from "react";

/* ----------------------------- Style injector ----------------------------- */
// If you don't want to modify index.html, this injects basic styles at runtime.
const baseCss = `
.app {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
header h1 { margin: 0; font-size: 1.35rem; }
header h2 { margin: 0.2rem 0 0.5rem; font-size: 1.15rem; color: #333; }
header p { color: #666; }
.instructions { background: #f8f9fa; border: 1px solid #e9ecef; padding: 1rem; margin: 1rem 0; border-radius: 6px; }
.instructions h3 { margin-top: 0; }
.paper-section { margin: 2rem 0; }
.paper-section .marks { color: #555; }
.question { border-top: 1px solid #ddd; padding-top: 1rem; margin-top: 1rem; }
.question-header { display: flex; justify-content: space-between; align-items: baseline; }
.prompt { margin: 0.5rem 0; line-height: 1.45; }
.subparts { margin-left: 1rem; border-left: 2px solid #eee; padding-left: 1rem; }
.subpart { margin: 0.5rem 0 0.75rem; }
.marks.small { color: #777; font-size: 0.85rem; }
.mcq { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; }
.mcq-option { display: flex; align-items: flex-start; gap: 0.5rem; background: #fafafa; border: 1px solid #eee; padding: 0.5rem; border-radius: 6px; }
.mcq-option input[type="radio"] { margin-top: 0.2rem; flex-shrink: 0; }
input[type="text"], textarea {
  width: 100%;
  padding: 0.55rem;
  border: 1px solid #ccc; border-radius: 6px;
  font-size: 0.95rem; margin-top: 0.25rem;
}
.actions { display: flex; gap: 0.75rem; margin-top: 2rem; }
button { padding: 0.55rem 0.9rem; border: none; border-radius: 6px; background: #0d6efd; color: white; cursor: pointer; }
button.secondary { background: #6c757d; }
button:disabled { background: #8fa9e8; cursor: not-allowed; }
.results { background: #f6f7fb; border: 1px solid #e1e3f0; padding: 1rem; border-radius: 6px; }
.feedback-section { margin: 1rem 0; }
.feedback-question { border-top: 1px dashed #cbd; padding-top: 0.75rem; }
.feedback-header { display: flex; justify-content: space-between; }
.feedback-note { color: #444; font-style: italic; }
footer { margin-top: 2rem; color: #666; font-size: 0.9rem; }
blockquote { background: #fff; border-left: 4px solid #0d6efd; padding: 0.75rem; margin-top: 1rem; }
`;

const StyleInjector = () => {
  useEffect(() => {
    const id = "paper-base-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = baseCss;
    document.head.appendChild(style);
  }, []);
  return null;
};

/* --------------------------- Data: paper structure --------------------------- */

const questions = [
  {
    id: "sectionA",
    title: "SECTION A – Question 1",
    totalMarks: 50,
    questions: [
      {
        id: "1.1",
        number: "1.1",
        prompt: "Various options are provided as possible answers to the following questions. Choose the answer and write only the letter (A–D) next to the question numbers (1.1.1 to 1.1.9) in the ANSWER BOOK, e.g. 1.1.10 D.",
        type: "long",
        marks: 18,
        children: [
          {
            id: "1.1.1",
            label: "1.1.1",
            type: "mcq",
            marks: 2,
            prompt: "The scientist who discovered the fossil 'Karabo' (A. sediba):",
            options: [
              { letter: "A", text: "Robert Brown" },
              { letter: "B", text: "Lee Berger" },
              { letter: "C", text: "Raymond Dart" },
              { letter: "D", text: "Ronald Clarke" }
            ]
          },
          {
            id: "1.1.2",
            label: "1.1.2",
            type: "mcq",
            marks: 2,
            prompt: "Which ONE of the following is a source of variation that occurs during normal meiosis?",
            options: [
              { letter: "A", text: "Random mating" },
              { letter: "B", text: "Random arrangement of chromosomes" },
              { letter: "C", text: "Chromosomal mutations" },
              { letter: "D", text: "Cloning" }
            ]
          },
          {
            id: "1.1.3",
            label: "1.1.3",
            type: "mcq",
            marks: 2,
            prompt: "How many sex chromosomes does a normal human female inherit from her mother?",
            options: [
              { letter: "A", text: "1" },
              { letter: "B", text: "2" },
              { letter: "C", text: "23" },
              { letter: "D", text: "46" }
            ]
          },
          {
            id: "1.1.4",
            label: "1.1.4",
            type: "mcq",
            marks: 2,
            prompt: "During which phase of meiosis does the nuclear membrane disappear?",
            options: [
              { letter: "A", text: "Metaphase" },
              { letter: "B", text: "Telophase" },
              { letter: "C", text: "Prophase" },
              { letter: "D", text: "Anaphase" }
            ]
          },
          {
            id: "1.1.5",
            label: "1.1.5",
            type: "mcq",
            marks: 2,
            prompt: "Which ONE of the following is an example of discontinuous variation in humans?",
            options: [
              { letter: "A", text: "Height" },
              { letter: "B", text: "Heart rate" },
              { letter: "C", text: "Gender" },
              { letter: "D", text: "Weight" }
            ]
          },
          {
            id: "1.1.6",
            label: "1.1.6",
            type: "mcq",
            marks: 2,
            prompt: "For a particular characteristic, the offspring inherits …",
            options: [
              { letter: "A", text: "one allele from the mother and one allele from the father." },
              { letter: "B", text: "both alleles from the father." },
              { letter: "C", text: "both alleles from the mother." },
              { letter: "D", text: "the alleles from either the mother or the father randomly." }
            ]
          },
          {
            id: "1.1.7",
            label: "1.1.7",
            type: "mcq",
            marks: 2,
            prompt: "Which ONE of the following is CORRECT for speciation through geographic isolation?",
            options: [
              { letter: "A", text: "The populations undergo phenotypic changes only." },
              { letter: "B", text: "Each population undergoes natural selection independently." },
              { letter: "C", text: "The conditions on each side of the geographic barrier are the same." },
              { letter: "D", text: "The new species formed are genotypically the same as the original species." }
            ]
          },
          {
            id: "1.1.8",
            label: "1.1.8",
            type: "mcq",
            marks: 2,
            prompt: "Below is a list of events that occur during cell division. Which ONE of the following combinations occur in both meiosis and mitosis?",
            options: [
              { letter: "A", text: "(ii), (iii) and (iv) only" },
              { letter: "B", text: "(i) and (iv) only" },
              { letter: "C", text: "(i), (iii) and (iv) only" },
              { letter: "D", text: "(ii) and (iv) only" }
            ]
          },
          {
            id: "1.1.9",
            label: "1.1.9",
            type: "mcq",
            marks: 2,
            image: "picture119",
            prompt: "A short piece of DNA, containing 19 nucleotides in each strand, was analysed. How many nucleotides containing thymine (T) were present in strand 1?",
            options: [
              { letter: "A", text: "8" },
              { letter: "B", text: "4" },
              { letter: "C", text: "6" },
              { letter: "D", text: "2" }
            ]
          }
        ]
      },
      {
        id: "1.2",
        number: "1.2",
        prompt: "Give the correct biological term for each of the following descriptions. Write only the term next to the question numbers (1.2.1 to 1.2.9) in the ANSWER BOOK.",
        type: "long",
        marks: 9,
        children: [
          { id: "1.2.1", label: "1.2.1", type: "short", marks: 1, prompt: "The process of change in the characteristics of biological species over time" },
          { id: "1.2.2", label: "1.2.2", type: "short", marks: 1, prompt: "The type of bonds between nitrogenous bases in a DNA molecule" },
          { id: "1.2.3", label: "1.2.3", type: "short", marks: 1, prompt: "The structure that joins two chromatids of a chromosome" },
          { id: "1.2.4", label: "1.2.4", type: "short", marks: 1, prompt: "The division of the cytoplasm of a cell during cell division" },
          { id: "1.2.5", label: "1.2.5", type: "short", marks: 1, prompt: "The process during meiosis where there is an exchange of genetic material between chromatids" },
          { id: "1.2.6", label: "1.2.6", type: "short", marks: 1, prompt: "The structures in animal cells that give rise to spindle fibres during cell division" },
          { id: "1.2.7", label: "1.2.7", type: "short", marks: 1, prompt: "Similar structures that are inherited from a common ancestor and are modified for different functions" },
          { id: "1.2.8", label: "1.2.8", type: "short", marks: 1, prompt: "The phase in the cell cycle during which DNA replication takes place" },
          { id: "1.2.9", label: "1.2.9", type: "short", marks: 1, prompt: "The organelle where translation occurs during protein synthesis" }
        ]
      },
      {
        id: "1.3",
        number: "1.3",
        prompt: "Indicate whether each of the descriptions in COLUMN I applies to A ONLY, B ONLY, BOTH A AND B or NONE of the items in COLUMN II. Write A only, B only, both A and B or none next to the question numbers (1.3.1 to 1.3.3) in the ANSWER BOOK.",
        type: "long",
        marks: 6,
        image: "picture13.png",
        children: [
          {
            id: "1.3.1",
            label: "1.3.1",
            type: "short",
            marks: 2,
            prompt: "Type of evolution characterised by long periods of little or no change alternating with short periods of rapid change",
            options: [
              { letter: "A", text: "Artificial selection" },
              { letter: "B", text: "Punctuated equilibrium" }
            ]
          },
          {
            id: "1.3.2",
            label: "1.3.2",
            type: "short",
            marks: 2,
            prompt: "A plant with white flowers that is crossed with a plant with red flowers and produces offspring with pink flowers",
            options: [
              { letter: "A", text: "Incomplete dominance" },
              { letter: "B", text: "Complete dominance" }
            ]
          },
          {
            id: "1.3.3",
            label: "1.3.3",
            type: "short",
            marks: 2,
            prompt: "The separation of alleles during gamete formation",
            options: [
              { letter: "A", text: "Law of Dominance" },
              { letter: "B", text: "Principle of Segregation" }
            ]
          }
        ]
      },
      {
        id: "1.4",
        number: "1.4",
        prompt: "Moyamoya is a disorder caused by a dominant allele (R). This disorder damages the arteries supplying blood to the brain. The pedigree diagram below shows the inheritance of Moyamoya in a family.",
        type: "long",
        marks: 5,
        image: "picture14.png",
        children: [
          {
            id: "1.4.1",
            label: "1.4.1",
            type: "short",
            marks: 1,
            prompt: "How many generations are represented in the diagram?"
          },
          {
            id: "1.4.2a",
            label: "1.4.2 (a)",
            type: "short",
            marks: 1,
            prompt: "LETTER(S) of unaffected males"
          },
          {
            id: "1.4.2b",
            label: "1.4.2 (b)",
            type: "short",
            marks: 1,
            prompt: "Genotype of individual A"
          },
          {
            id: "1.4.2c",
            label: "1.4.2 (c)",
            type: "short",
            marks: 2,
            prompt: "LETTER(S) of individuals not biologically related to A and B"
          }
        ]
      },
      {
        id: "1.5",
        number: "1.5",
        prompt: "The diagram below represents part of an abnormal human karyotype.",
        type: "long",
        marks: 5,
        image: "picture15.png",
        children: [
          {
            id: "1.5.1",
            label: "1.5.1",
            type: "short",
            marks: 1,
            prompt: "How many autosomes are shown in the diagram?"
          },
          {
            id: "1.5.2",
            label: "1.5.2",
            type: "short",
            marks: 1,
            prompt: "Name the type of chromosomes represented by pair 23."
          },
          {
            id: "1.5.3a",
            label: "1.5.3 (a)",
            type: "short",
            marks: 1,
            prompt: "Disorder represented in the diagram"
          },
          {
            id: "1.5.3b",
            label: "1.5.3 (b)",
            type: "short",
            marks: 1,
            prompt: "Process during anaphase of meiosis that resulted in the abnormal number of chromosomes in this karyotype"
          },
          {
            id: "1.5.4",
            label: "1.5.4",
            type: "short",
            marks: 1,
            prompt: "State the gender of the person represented in this karyotype."
          }
        ]
      },
      {
        id: "1.6",
        number: "1.6",
        prompt: "In rabbits, brown fur (B) is dominant to white fur (b) and long ears (E) is dominant to short ears (e). A rabbit, that is heterozygous for both characteristics, is crossed with a white rabbit with short ears.",
        type: "long",
        marks: 7,
        children: [
          {
            id: "1.6.1",
            label: "1.6.1",
            type: "short",
            marks: 1,
            prompt: "Name the type of cross represented."
          },
          {
            id: "1.6.2a",
            label: "1.6.2 (a)",
            type: "short",
            marks: 2,
            prompt: "Phenotype of a rabbit that is dominant for both characteristics"
          },
          {
            id: "1.6.2b",
            label: "1.6.2 (b)",
            type: "short",
            marks: 2,
            prompt: "Genotype of the white rabbit with short ears"
          },
          {
            id: "1.6.2c",
            label: "1.6.2 (c)",
            type: "short",
            marks: 2,
            prompt: "Genotype of the gametes of a heterozygous brown rabbit with short ears"
          }
        ]
      }
    ]
  },
  {
    id: "sectionB",
    title: "SECTION B",
    totalMarks: 100,
    questions: [
      {
        id: "2",
        number: "QUESTION 2",
        prompt: "",
        type: "long",
        marks: 50,
        children: [
          {
            id: "2.1",
            number: "2.1",
            label: "2.1",
            prompt: "The diagram below represents transcription during protein synthesis.",
            type: "long",
            marks: 8,
            image: "picture21.png",
            children: [
              {
                id: "2.1.1",
                label: "2.1.1",
                type: "short",
                marks: 1,
                prompt: "Name the part of the cell where this process occurs."
              },
              {
                id: "2.1.2a",
                label: "2.1.2 (a)",
                type: "short",
                marks: 1,
                prompt: "Sugar X"
              },
              {
                id: "2.1.2b",
                label: "2.1.2 (b)",
                type: "short",
                marks: 1,
                prompt: "Nitrogenous base Y"
              },
              {
                id: "2.1.3",
                label: "2.1.3",
                type: "multi",
                marks: 5,
                prompt: "Tabulate TWO differences between transcription and DNA replication."
              }
            ]
          },
          {
            id: "2.2",
            number: "2.2",
            prompt: "A mutation has occurred on a section of an mRNA molecule as shown below. Original sequence: AUG GAA AUA CCG CCA GGA. Mutated sequence: AUG GAA AUA CUG CCA GGA.",
            type: "long",
            marks: 8,
            image:"picture22.png",
            children: [
              {
                id: "2.2.1",
                label: "2.2.1",
                type: "short",
                marks: 1,
                prompt: "Name the type of mutation that has occurred."
              },
              {
                id: "2.2.2",
                label: "2.2.2",
                type: "short",
                marks: 1,
                prompt: "Give a reason for your answer to QUESTION 2.2.1."
              },
              {
                id: "2.2.3a",
                label: "2.2.3 (a)",
                type: "short",
                marks: 1,
                prompt: "State the number of different amino acids coded for by the original sequence of the mRNA molecule given above."
              },
              {
                id: "2.2.3b",
                label: "2.2.3 (b)",
                type: "short",
                marks: 1,
                prompt: "Give the anticodon on the tRNA molecule that carries the amino acid isoleucine."
              },
              {
                id: "2.2.3c",
                label: "2.2.3 (c)",
                type: "long",
                marks: 4,
                prompt: "Use information in the table to describe the effect of the mutation on the protein formed."
              }
            ]
          },
          {
            id: "2.3",
            number: "2.3",
            prompt: "The number of chromosomes in the somatic cells of organisms differs from species to species. The graph below shows the number of chromosomes in each somatic cell of THREE different species.",
            type: "long",
            marks: 10,
            image: "picture23.png",
            children: [
              {
                id: "2.3.1a",
                label: "2.3.1 (a)",
                type: "short",
                marks: 1,
                prompt: "How many chromosomes will be present in mouse cells during Telophase II of meiosis?"
              },
              {
                id: "2.3.1b",
                label: "2.3.1 (b)",
                type: "short",
                marks: 1,
                prompt: "A leaf cell of a pineapple plant"
              },
              {
                id: "2.3.2",
                label: "2.3.2",
                type: "long",
                marks: 4,
                prompt: "Explain why the sperm cell of a giraffe has 15 chromosomes."
              },
              {
                id: "2.3.3",
                label: "2.3.3",
                type: "short",
                marks: 1,
                prompt: "Name the phase of meiosis where the halving of the chromosome number begins."
              },
              {
                id: "2.3.4",
                label: "2.3.4",
                type: "long",
                marks: 3,
                prompt: "Describe the events in the phase named in QUESTION 2.3.3."
              }
            ]
          },
          {
            id: "2.4",
            number: "2.4",
            prompt: "The table below shows information about blood groups in a certain population.",
            type: "long",
            marks: 7,
            image: "picture24.png",
            children: [
              {
                id: "2.4.1",
                label: "2.4.1",
                type: "short",
                marks: 1,
                prompt: "How many people have the genotype ii?"
              },
              {
                id: "2.4.2",
                label: "2.4.2",
                type: "long",
                marks: 3,
                prompt: "The population size is 1 800 000. Calculate the value of X. Show ALL working."
              },
              {
                id: "2.4.3",
                label: "2.4.3",
                type: "long",
                marks: 3,
                prompt: "Describe how a child inherits the blood group represented by 3 per cent of this population."
              }
            ]
          },
          {
            id: "2.5",
            number: "2.5",
            prompt: "The diagram below represents the DNA profiles of three children and their parents. Only two of the children are their biological children and one is adopted.",
            type: "long",
            marks: 7,
            image: "picture25.png",
            children: [
              {
                id: "2.5.1",
                label: "2.5.1",
                type: "multi",
                marks: 2,
                prompt: "Identify the TWO biological children."
              },
              {
                id: "2.5.2",
                label: "2.5.2",
                type: "long",
                marks: 2,
                prompt: "Explain your answer to QUESTION 2.5.1."
              },
              {
                id: "2.5.3",
                label: "2.5.3",
                type: "multi",
                marks: 3,
                prompt: "State THREE other uses of DNA profiling."
              }
            ]
          },
          {
            id: "2.6",
            number: "2.6",
            prompt: "Brown enamel of the teeth is a sex-linked trait. A dominant allele on the X chromosome causes brown teeth in humans.",
            type: "long",
            marks: 10,
            children: [
              {
                id: "2.6.1",
                label: "2.6.1",
                type: "long",
                marks: 4,
                prompt: "Explain why more males than females have white teeth."
              },
              {
                id: "2.6.2",
                label: "2.6.2",
                type: "long",
                marks: 6,
                prompt: "A man with brown teeth married a woman with white teeth. Use a genetic cross to show the possible phenotypic ratios of their children. Use XB for brown teeth and Xb for white teeth."
              }
            ]
          }
        ]
      },
      {
        id: "3",
        number: "QUESTION 3",
        prompt: "",
        type: "long",
        marks: 50,
        children: [
          {
            id: "3.1",
            number: "3.1",
            prompt: "Read the extract below. When a child is born, the umbilical cord is cut and stem cells can be obtained from it. Many people think that the stem cells for treating human conditions should be obtained from umbilical cords, rather than from human embryos. Recently, stem cells have also been obtained from bone marrow. These stem cells are used to treat conditions such as heart disease and spinal injuries.",
            type: "long",
            marks: 6,
            image:"picture31.png",
            children: [
              {
                id: "3.1.1",
                label: "3.1.1",
                type: "multi",
                marks: 3,
                prompt: "Name THREE sources of stem cells mentioned in the extract."
              },
              {
                id: "3.1.2",
                label: "3.1.2",
                type: "long",
                marks: 2,
                prompt: "Explain why the characteristics of stem cells make them useful for treating some disorders."
              },
              {
                id: "3.1.3",
                label: "3.1.3",
                type: "short",
                marks: 1,
                prompt: "Name ONE condition in the extract that can be treated with stem cells."
              }
            ]
          },
          {
            id: "3.2",
            number: "3.2",
            prompt: "Read the extract below. Samango and vervet are two species of monkeys that occupy the same habitat. Researchers have recently discovered that a population of samango monkeys were able to interbreed with vervet monkeys to produce offspring. These offspring were infertile.",
            type: "long",
            marks: 7,
            image:"picture32.png",
            children: [
              {
                id: "3.2.1",
                label: "3.2.1",
                type: "long",
                marks: 3,
                prompt: "Define the term population."
              },
              {
                id: "3.2.2",
                label: "3.2.2",
                type: "short",
                marks: 1,
                prompt: "Give ONE reason why samango and vervet monkeys are considered to be two different species."
              },
              {
                id: "3.2.3",
                label: "3.2.3",
                type: "multi",
                marks: 3,
                prompt: "List THREE mechanisms of reproductive isolation that are NOT mentioned above."
              }
            ]
          },
          {
            id: "3.3",
            number: "3.3",
            prompt: "Scientists find evidence for human evolution by comparing humans to other hominids. The upper limbs of humans and African apes show similar characteristics, whereas there are differences between the dentition (teeth) of the two.",
            type: "long",
            marks: 5,
            children: [
              {
                id: "3.3.1",
                label: "3.3.1",
                type: "short",
                marks: 1,
                prompt: "Why do scientists look for similarities between humans and African apes?"
              },
              {
                id: "3.3.2",
                label: "3.3.2",
                type: "long",
                marks: 2,
                prompt: "Explain the importance of the positioning of the thumbs for humans and African apes."
              },
              {
                id: "3.3.3",
                label: "3.3.3",
                type: "short",
                marks: 2,
                prompt: "State ONE difference between the teeth of humans and African apes."
              }
            ]
          },
          {
            id: "3.4",
            number: "3.4",
            prompt: "The diagram below represents one model of the evolution of some hominids.",
            type: "long",
            marks: 14,
            image: "picture34.png",
            children: [
              {
                id: "3.4.1",
                label: "3.4.1",
                type: "short",
                marks: 1,
                prompt: "Identify the type of diagram shown."
              },
              {
                id: "3.4.2",
                label: "3.4.2",
                type: "short",
                marks: 1,
                prompt: "How many genera are represented by the diagram?"
              },
              {
                id: "3.4.3a",
                label: "3.4.3 (a)",
                type: "short",
                marks: 1,
                prompt: "Species represented by X on the diagram"
              },
              {
                id: "3.4.3b",
                label: "3.4.3 (b)",
                type: "short",
                marks: 1,
                prompt: "That shares a common ancestor with Homo erectus"
              },
              {
                id: "3.4.4",
                label: "3.4.4",
                type: "short",
                marks: 1,
                prompt: "Which species of the genus Homo is the only one in existence today?"
              },
              {
                id: "3.4.5",
                label: "3.4.5",
                type: "multi",
                marks: 2,
                prompt: "Name TWO forms of evidence that would have been used to support the information in the diagram."
              },
              {
                id: "3.4.6",
                label: "3.4.6",
                type: "long",
                marks: 3,
                prompt: "The average cranial capacity of Homo sapiens is 1 500 cm3 compared to 520 cm3 in Australopithecus africanus. Explain the significance of the difference in cranial capacity."
              },
              {
                id: "3.4.7",
                label: "3.4.7",
                type: "long",
                marks: 4,
                prompt: "Explain how the fossils of Australopithecus africanus, Species X and Homo erectus are used to support the 'Out of Africa' hypothesis."
              }
            ]
          },
          {
            id: "3.5",
            number: "3.5",
            prompt: "Modern-day whales are aquatic mammals, spending their entire lives in the ocean. They are thought to have evolved from four-legged ancestors, as represented below.",
            type: "long",
            marks: 8,
            image: "picture35.png",
            children: [
              {
                id: "3.5.1",
                label: "3.5.1",
                type: "short",
                marks: 1,
                prompt: "Which ancestor of whales most likely lived both in water and on land?"
              },
              {
                id: "3.5.2",
                label: "3.5.2",
                type: "short",
                marks: 2,
                prompt: "Give ONE reason for your answer to QUESTION 3.5.1."
              },
              {
                id: "3.5.3",
                label: "3.5.3",
                type: "long",
                marks: 2,
                prompt: "Explain why Ambulocetus and Dorudon may be considered as transitional species in the evolution of whales."
              },
              {
                id: "3.5.4",
                label: "3.5.4",
                type: "long",
                marks: 3,
                prompt: "Explain, according to Lamarck, why modern-day whales do not have legs."
              }
            ]
          },
          {
            id: "3.6",
            number: "3.6",
            prompt: "Patients infected with the HI virus (HIV) are treated with antiretroviral drugs. When they miss their treatment, it can increase the chances (probability) of the virus developing resistance to the drug. Scientists conducted an investigation to determine the effect of the number of missed treatments on the probability of the HI virus developing resistance to antiretroviral drugs. The results are shown in the table below.",
            type: "long",
            marks: 10,
            image: "picture36.png",
            children: [
              {
                id: "3.6.1a",
                label: "3.6.1 (a)",
                type: "short",
                marks: 1,
                prompt: "The dependent variable"
              },
              {
                id: "3.6.1b",
                label: "3.6.1 (b)",
                type: "short",
                marks: 1,
                prompt: "The independent variable"
              },
              {
                id: "3.6.2",
                label: "3.6.2",
                type: "short",
                marks: 1,
                prompt: "Based on the results, state ONE precaution for patients receiving antiretroviral treatment."
              },
              {
                id: "3.6.3",
                label: "3.6.3",
                type: "long",
                marks: 2,
                prompt: "State a conclusion for this investigation."
              },
              {
                id: "3.6.4",
                label: "3.6.4",
                type: "long",
                marks: 5,
                prompt: "Describe the evolution of resistance to antiretroviral medication in the HI virus."
              }
            ]
          }
        ]
      }
    ]
  }
];

/* ------------------------------- Memo answers ------------------------------- */
// Official marking guidelines distilled into machine-gradable entries.
// For "long" answers, we use keyword matching (presence of memo-listed phrases).

const markingGuidelines = [
  // 1.1 MCQs
  { id: "1.1.1", marks: 2, type: "mcq", correct: "B" },
  { id: "1.1.2", marks: 2, type: "mcq", correct: "B" },
  { id: "1.1.3", marks: 2, type: "mcq", correct: "A" },
  { id: "1.1.4", marks: 2, type: "mcq", correct: "C" },
  { id: "1.1.5", marks: 2, type: "mcq", correct: "C" },
  { id: "1.1.6", marks: 2, type: "mcq", correct: "A" },
  { id: "1.1.7", marks: 2, type: "mcq", correct: "B" },
  { id: "1.1.8", marks: 2, type: "mcq", correct: "D" },
  { id: "1.1.9", marks: 2, type: "mcq", correct: "B" },

  // 1.2 terms
  { id: "1.2.1", marks: 1, type: "short", correct: "evolution" },
  { id: "1.2.2", marks: 1, type: "short", correct: "hydrogen bonds" },
  { id: "1.2.3", marks: 1, type: "short", correct: "centromere" },
  { id: "1.2.4", marks: 1, type: "short", correct: "cytokinesis" },
  { id: "1.2.5", marks: 1, type: "short", correct: "crossing over" },
  { id: "1.2.6", marks: 1, type: "short", correct: "centrosomes/centrioles" },
  { id: "1.2.7", marks: 1, type: "short", correct: "homologous structures" },
  { id: "1.2.8", marks: 1, type: "short", correct: "interphase" },
  { id: "1.2.9", marks: 1, type: "short", correct: "ribosome" },

  // 1.3 matching
  { id: "1.3.1", marks: 2, type: "short", correct: "b only" },
  { id: "1.3.2", marks: 2, type: "short", correct: "a only" },
  { id: "1.3.3", marks: 2, type: "short", correct: "b only" },

  // 1.4 pedigree
  { id: "1.4.1", marks: 1, type: "short", correct: "3/three" },
  { id: "1.4.2a", marks: 1, type: "short", correct: "d g" },
  { id: "1.4.2b", marks: 1, type: "short", correct: "rr" },
  { id: "1.4.2c", marks: 2, type: "short", correct: "e f h i j" },

  // 1.5 karyotype
  { id: "1.5.1", marks: 1, type: "short", correct: "45" },
  { id: "1.5.2", marks: 1, type: "short", correct: "gonosomes/sex chromosomes" },
  { id: "1.5.3a", marks: 1, type: "short", correct: "down syndrome/trisomy 21" },
  { id: "1.5.3b", marks: 1, type: "short", correct: "non-disjunction" },
  { id: "1.5.4", marks: 1, type: "short", correct: "male" },

  // 1.6 dihybrid
  { id: "1.6.1", marks: 1, type: "short", correct: "dihybrid cross" },
  { id: "1.6.2a", marks: 2, type: "short", correct: "brown fur and long ears" },
  { id: "1.6.2b", marks: 2, type: "short", correct: "bbee" },
  { id: "1.6.2c", marks: 2, type: "short", correct: "be" },

  // 2.1 transcription
  { id: "2.1.1", marks: 1, type: "short", correct: "nucleus/nucleoplasm" },
  { id: "2.1.2a", marks: 1, type: "short", correct: "deoxyribose" },
  { id: "2.1.2b", marks: 1, type: "short", correct: "uracil/u" },
  { id: "2.1.3", marks: 5, type: "multi", correct: ["only one strand acts as template", "both strands act as templates", "free rna nucleotides are complementary", "free dna nucleotides are complementary", "adenine complements uracil", "adenine pairs with thymine", "a mrna molecule is formed", "two identical dna molecules are formed", "only a short section of dna is used", "the whole dna molecule is used", "dna unwinds and unzips partially", "dna unwinds and unzips completely"], policy: "firstTwo" },

  // 2.2 mutation
  { id: "2.2.1", marks: 1, type: "short", correct: "gene mutation" },
  { id: "2.2.2", marks: 1, type: "short", correct: "change in sequence from ccg to cug" },
  { id: "2.2.3a", marks: 1, type: "short", correct: "5/five" },
  { id: "2.2.3b", marks: 1, type: "short", correct: "uau" },
  { id: "2.2.3c", marks: 4, type: "long", correct: ["codon ccg changed to cug", "4th codon has changed", "anticodon/trna sequence changed", "amino acid proline was replaced by leucine", "this resulted in a different protein/no protein being formed"] },

  // 2.3 chromosomes
  { id: "2.3.1a", marks: 1, type: "short", correct: "20" },
  { id: "2.3.1b", marks: 1, type: "short", correct: "50" },
  { id: "2.3.2", marks: 4, type: "long", correct: ["sperm cell is a gamete", "formed by meiosis", "must be haploid", "to overcome the doubling effect of fertilisation"] },
  { id: "2.3.3", marks: 1, type: "short", correct: "anaphase i" },
  { id: "2.3.4", marks: 3, type: "long", correct: ["spindle fibres shorten/contract", "chromosome pairs separate", "move to the opposite poles"] },

  // 2.4 blood groups
  { id: "2.4.1", marks: 1, type: "short", correct: "954 000" },
  { id: "2.4.2", marks: 3, type: "long", correct: ["612 000", "1 800 000 - (954 000 + 180 000 + 54 000)", "x = 612 000"] },
  { id: "2.4.3", marks: 3, type: "long", correct: ["allele for blood group a/ia is inherited from one parent", "allele for blood group b/ib is inherited from the other parent", "child has blood group ab/genotype iaib"] },

  // 2.5 dna profiling
  { id: "2.5.1", marks: 2, type: "multi", correct: ["heila", "leo"], policy: "firstTwo" },
  { id: "2.5.2", marks: 2, type: "long", correct: ["all of the (dna) bands from heila and leo match with the (dna) bands of the mother and the father", "none of the (dna) bands from priya match with the (dna) bands of the mother and the father"] },
  { id: "2.5.3", marks: 3, type: "multi", correct: ["tracing missing persons", "identification of genetic disorders", "identification of suspects in a crime", "matching tissues for organ transplants", "identifying dead persons"], policy: "firstThree" },

  // 2.6 sex-linked
  { id: "2.6.1", marks: 4, type: "long", correct: ["males have only one x chromosome", "the y-chromosome does not have this allele", "have to inherit only one recessive allele to have white teeth", "females have two x chromosomes", "have to inherit two recessive alleles to have white teeth"] },
  { id: "2.6.2", marks: 6, type: "long", correct: ["p1: male with brown teeth x female with white teeth", "genotype: xby x xbx b", "meiosis", "gametes: xb y x xb x xb", "f1 genotype: xbx b xbx b xby xby", "phenotype: 1 female with brown teeth: 1 male with white teeth", "p1 and f1", "meiosis and fertilisation"] },

  // 3.1 stem cells
  { id: "3.1.1", marks: 3, type: "multi", correct: ["embryos", "umbilical cord", "bone marrow"], policy: "firstThree" },
  { id: "3.1.2", marks: 2, type: "long", correct: ["stem cells are undifferentiated", "have the potential to develop into any type of cell", "to replace affected/defective cells causing a disorder"] },
  { id: "3.1.3", marks: 1, type: "short", correct: "heart disease/spinal injuries" },

  // 3.2 species
  { id: "3.2.1", marks: 3, type: "long", correct: ["group of organisms of the same species", "occupying the same habitat", "at the same time"] },
  { id: "3.2.2", marks: 1, type: "short", correct: "produce infertile offspring" },
  { id: "3.2.3", marks: 3, type: "multi", correct: ["breeding at different times of the year", "species-specific courtship behaviour", "adaptation to different pollinators", "prevention of fertilisation"], policy: "firstThree" },

  // 3.3 evolution evidence
  { id: "3.3.1", marks: 1, type: "short", correct: "to show a possible common ancestor/to identify trends in evolution" },
  { id: "3.3.2", marks: 2, type: "long", correct: ["both have opposable thumbs", "to allow for a power grip/precision grip/any example thereof"] },
  { id: "3.3.3", marks: 2, type: "short", correct: "humans have small teeth/canines whereas african apes have large teeth/canines/there are no gaps/diastema between the teeth in humans whereas african apes have gaps/diastema between the teeth" },

  // 3.4 phylogenetic tree
  { id: "3.4.1", marks: 1, type: "short", correct: "phylogenetic tree/cladogram" },
  { id: "3.4.2", marks: 1, type: "short", correct: "2/two" },
  { id: "3.4.3a", marks: 1, type: "short", correct: "homo habilis" },
  { id: "3.4.3b", marks: 1, type: "short", correct: "(homo) naledi" },
  { id: "3.4.4", marks: 1, type: "short", correct: "(homo) sapiens" },
  { id: "3.4.5", marks: 2, type: "multi", correct: ["fossil evidence", "cultural evidence", "genetic evidence"], policy: "firstTwo" },
  { id: "3.4.6", marks: 3, type: "long", correct: ["large cranial capacity in homo sapiens indicates a larger brain", "leading to greater intelligence", "small cranial capacity in australopithecus africanus indicates a smaller brain", "leading to lower intelligence"] },
  { id: "3.4.7", marks: 4, type: "long", correct: ["fossils of australopithecus spp. were found in africa only", "fossils of species x/homo habilis were found in africa only", "the oldest fossils of homo erectus were found in africa/the younger fossils were found elsewhere", "indicating that modern humans originated in africa and migrated out of africa"] },

  // 3.5 whale evolution
  { id: "3.5.1", marks: 1, type: "short", correct: "ambulocetus" },
  { id: "3.5.2", marks: 2, type: "short", correct: "it had flipper-like large feet and a tail" },
  { id: "3.5.3", marks: 2, type: "long", correct: ["they share characteristics/have intermediate characteristics of the ancestor/pakicetus and the present-day species/balaena", "they have legs like pakicetus and flippers of the present day balaena"] },
  { id: "3.5.4", marks: 3, type: "long", correct: ["ancestral species of whales all had legs/lived on land", "as more time was spent in the water in search of food", "the legs were used less and disappeared", "the acquired characteristic was passed on to the next generation"] },

  // 3.6 hiv resistance
  { id: "3.6.1a", marks: 1, type: "short", correct: "probability of developing resistance to antiretroviral drugs" },
  { id: "3.6.1b", marks: 1, type: "short", correct: "number of missed treatments" },
  { id: "3.6.2", marks: 1, type: "short", correct: "treatment must not be missed" },
  { id: "3.6.3", marks: 2, type: "long", correct: ["probability of hiv developing resistance to antiretroviral drugs increases with the increase in the number of missed treatments", "the more the days of missed treatment, the greater the probability of the virus developing resistance to antiretroviral drugs"] },
  { id: "3.6.4", marks: 5, type: "long", correct: ["there is variation in the resistance of the hi virus to antiretroviral drugs", "some viruses are resistant to the drugs and others are not resistant", "those that are not resistant do not survive", "when treatments are missed, the resistant viruses survive and reproduce", "passing the resistance to their offspring"] }
];

/* ------------------------------- Evaluator ---------------------------------- */

function evaluateSubmission(answers, memo) {
  const perQuestion = {};
  let totalAwarded = 0;

  memo.forEach(entry => {
    const learner = answers[entry.id];
    const max = entry.marks;

    let awarded = 0;
    let feedback = "";

    if (entry.type === "mcq" || entry.type === "short") {
      const corr = entry.correct;
      const learnerStr = typeof learner === "string" ? learner : "";
      const left = normalize(learnerStr);
      const right = normalize(corr);

      awarded = left === right ? max : 0;
    } else if (entry.type === "multi") {
      const corrList = Array.isArray(entry.correct) ? entry.correct.map(normalize) : [normalize(entry.correct)];
      const learnerList = Array.isArray(learner)
          ? learner.map(normalize)
          : (typeof learner === "string" ? learner.split("\n").map(s => normalize(s)) : []);

      const firstCount =
          entry.policy === "firstOne" ? 1 :
              entry.policy === "firstTwo" ? 2 :
                  entry.policy === "firstThree" ? 3 : corrList.length;

      const considered = learnerList.slice(0, firstCount);
      const correctHits = considered.filter(ans => corrList.includes(ans)).length;

      awarded = Math.min(correctHits, max);
      feedback = `Marked first ${firstCount} item(s). ${correctHits} correct item(s) recognised.`;
    } else if (entry.type === "long") {
      const corrList = Array.isArray(entry.correct) ? entry.correct : [entry.correct];
      const learnerStr = typeof learner === "string" ? normalize(learner) : "";
      const matches = corrList.filter(k => {
        const key = normalize(k);
        return key && learnerStr.includes(key);
      }).length;
      awarded = Math.min(matches, max);
      feedback = matches > 0 ? `Detected ${matches} key point(s).` : "No required key points detected.";
    }

    perQuestion[entry.id] = {
      awarded,
      max,
      correct: entry.correct,
      learner,
      feedback
    };
    totalAwarded += awarded;
  });

  return { totalAwarded, perQuestion };
}

function normalize(s) {
  return (s || "").trim().toLowerCase();
}

/* ------------------------------ UI components ------------------------------ */

const PaperInstructions = () => (
    <section className="instructions">
      <h3>Instructions and information</h3>
      <ul>
        <li>Answer ALL the questions.</li>
        <li>Write ALL the answers in the ANSWER BOOK (digitally captured here).</li>
        <li>Start the answers to EACH question at the top of a NEW page (sections are separated below).</li>
        <li>Number the answers correctly according to the numbering system used in this question paper.</li>
        <li>Present your answers according to the instructions of each question.</li>
        <li>Draw diagrams, tables or flow charts only when asked to do so.</li>
        <li>Use a non-programmable calculator, protractor and compass where necessary.</li>
        <li>Write neatly and legibly.</li>
      </ul>
    </section>
);

const Section = ({ section, answers, onChange }) => (
    <section className="paper-section">
      <h2>{section.title}</h2>
      <p className="marks">Total for this section: {section.totalMarks}</p>
      {section.questions.map(q => (
          <QuestionBlock
              key={q.id}
              question={q}
              answers={answers}
              onChange={onChange}
          />
      ))}
    </section>
);

const QuestionBlock = ({ question, answers, onChange }) => {
  const value = answers[question.id];

  return (
      <div className="question">

        {/* Header */}
        <div className="question-header">
          <strong>{question.number}</strong>
          <span className="marks">{question.marks} mark(s)</span>
        </div>

        {/* Prompt */}
        <p className="prompt">{question.prompt}</p>

        {/* ---------- IMAGE HERE ---------- */}
        {question.image && (
            <div className="question-image">
              <img
                  src={`/assets/${question.image}`}
                  alt="question visual"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            </div>
        )}
        {/* ---------- END IMAGE ---------- */}

        {/* Main Question (no children) */}
        {!question.children && (
            <InputForQuestion
                qid={question.id}
                type={question.type}
                options={question.options}
                value={value}
                onChange={onChange}
            />
        )}

        {/* Sub-questions */}
        {question.children && (
            <div className="subparts">
              {question.children.map(c => {
                const subVal = answers[c.id];
                return (
                    <div className="subpart" key={c.id}>

                      {c.label && <strong>{c.label}</strong>}
                      {c.prompt && <p className="prompt">{c.prompt}</p>}

                      {/* ---------- IMAGE FOR SUBPART ---------- */}
                      {c.image && (
                          <img
                              src={`/assets/${c.image}`}
                              alt="sub-question visual"
                              style={{ maxWidth: "100%", margin: "8px 0" }}
                          />
                      )}
                      {/* ---------- END IMAGE ---------- */}

                      <InputForQuestion
                          qid={c.id}
                          type={c.type}
                          options={c.options}
                          value={subVal}
                          onChange={onChange}
                      />
                      <span className="marks small">{c.marks} mark(s)</span>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
};
const InputForQuestion = ({ qid, type, options, value, onChange }) => {
  if (type === "mcq") {
    return (
        <div className="mcq">
          {options?.map(opt => (
              <label key={opt.letter} className="mcq-option">
                <input
                    type="radio"
                    name={qid}
                    value={opt.letter}
                    checked={value === opt.letter}
                    onChange={() => onChange(qid, opt.letter)}
                />
                <span>{opt.letter}. {opt.text}</span>
              </label>
          ))}
        </div>
    );
  }
  if (type === "short") {
    return (
        <input
            type="text"
            placeholder="Your answer"
            value={value || ""}
            onChange={e => onChange(qid, e.target.value)}
        />
    );
  }
  if (type === "multi") {
    return (
        <textarea
            placeholder="Enter multiple items (one per line)"
            value={Array.isArray(value) ? value.join("\n") : value || ""}
            onChange={e =>
                onChange(qid, e.target.value.split("\n").map(s => s.trim()).filter(Boolean))
            }
        />
    );
  }
  return (
      <textarea
          placeholder="Write your full answer"
          value={value || ""}
          onChange={e => onChange(qid, e.target.value)}
          rows={4}
      />
  );
};

const ResultsPanel = ({ result, totalMarks, questions, onReset }) => {
  const percentage = Math.round((result.totalAwarded / totalMarks) * 100);
  return (
      <section className="results">
        <h2>Your results</h2>
        <p>
          <strong>Score:</strong> {result.totalAwarded} / {totalMarks} ({percentage}%)
        </p>
        <div className="feedback-list">
          {questions.map(sec => (
              <div className="feedback-section" key={sec.id}>
                <h3>{sec.title}</h3>
                {sec.questions.map(q => {
                  const entry = result.perQuestion[q.id];
                  return (
                      <div className="feedback-question" key={q.id}>
                        <div className="feedback-header">
                          <strong>{q.number}</strong>
                          <span>{entry?.awarded ?? 0} / {entry?.max ?? q.marks}</span>
                        </div>
                        <p className="prompt">{q.prompt}</p>
                        {!q.children && entry && (
                            <div className="feedback-body">
                              <p><strong>Your answer:</strong> {format(entry.learner)}</p>
                              <p><strong>Correct answer:</strong> {format(entry.correct)}</p>
                              {entry.feedback && <p className="feedback-note">{entry.feedback}</p>}
                            </div>
                        )}
                        {q.children && q.children.map(c => {
                          const sub = result.perQuestion[c.id];
                          return (
                              <div className="feedback-sub" key={c.id}>
                                <p><strong>{c.label || ""}</strong> {sub?.awarded ?? 0} / {sub?.max ?? c.marks}</p>
                                <p><strong>Your answer:</strong> {format(sub?.learner)}</p>
                                <p><strong>Correct answer:</strong> {format(sub?.correct)}</p>
                                {sub?.feedback && <p className="feedback-note">{sub.feedback}</p>}
                              </div>
                          );
                        })}
                      </div>
                  );
                })}
              </div>
          ))}
        </div>
        <div className="actions">
          <button onClick={onReset}>Try again</button>
        </div>
        <blockquote>
          Marking follows the official memo (e.g., “mark first TWO only”, “first ONE only”, and keyword credit for long answers).
        </blockquote>
      </section>
  );
};

function format(val) {
  if (val === undefined) return "—";
  return Array.isArray(val) ? val.join("; ") : String(val);
}

/* --------------------------------- App root -------------------------------- */

function App() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  // Timer states
  const [timeLeft, setTimeLeft] = useState(105 * 60); // 150 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);

  const totalMarks = useMemo(
      () => questions.reduce((sum, sec) => sum + sec.totalMarks, 0),
      [questions]
  );

  const onChange = useCallback((qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }, []);

  const onSubmit = useCallback(() => {
    const evalResult = evaluateSubmission(answers, markingGuidelines);
    setResult(evalResult);
    setSubmitted(true);
    setTimerActive(false); // Stop timer
  }, [answers, markingGuidelines]);

  const onReset = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setTimeLeft(105 * 60);
    setTimerActive(true);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (!timerActive || submitted) return;
    if (timeLeft <= 0) {
      onSubmit(); // Auto-submit
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, timerActive, submitted, onSubmit]);

  // Format time
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // JSX RETURN STATEMENT - ENSURE THIS IS INSIDE THE FUNCTION
  return (
      <div className="app">
        <StyleInjector />
        <header>
          <h1>NATIONAL SENIOR CERTIFICATE</h1>
          <h2>GRADE 12 – LIFE SCIENCES P2 – NOVEMBER 2022</h2>
          <p>Marks: {totalMarks} | Time: 2½ hours</p>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: timeLeft < 300 ? "red" : "green" }}>
            ⏳ Time Remaining: {formatTime(timeLeft)}
          </div>
        </header>

        <PaperInstructions />

        {!submitted && (
            <>
              {questions.map(section => (
                  <Section
                      key={section.id}
                      section={section}
                      answers={answers}
                      onChange={onChange}
                  />
              ))}
              <div className="actions">
                <button onClick={onSubmit} disabled={Object.keys(answers).length === 0}>
                  Submit answers
                </button>
                <button className="secondary" onClick={onReset}>Clear all</button>
              </div>
            </>
        )}

        {submitted && result && (
            <ResultsPanel
                result={result}
                totalMarks={totalMarks}
                questions={questions}
                onReset={onReset}
            />
        )}

        <footer>
          <p>This digital paper mirrors the DBE Life Sciences P2 November 2022. Marking uses the official memo.</p>
        </footer>
      </div>
  );
}  // <-- THIS CLOSING } MATCHES function App() {

export default App;