// Harold Thimbleby, 2020-2021
// JSON data and Javascript code to process it

'use strict';

// documentation for fields in the JSON data
// you don't need to use all fields in the data (flags default to unset)
// first we start with definitions of all the data fields
var descriptionsOfFields = {
    accessed: {
        documentation: "Date when accessed",
        essential: 1
    },
    doubleChecked: {
        documentation: "Date when double checked",
        essential: 1
    },
    authors: {
        // surname initials comma-separated list
        // code can be modified to generate author lists in other formats as required by journal
        // search for function fixAuthors(s) to see what we do:
        //     list comma-separated authors, final one with 'and' but then say et al if more than maxAuthors authors
        documentation: "Authors",
        essential: 1
    },
    codeComment: {
        documentation: "Evaluator's notes about code",
        essential: 1
    },
    codeURL: {
        documentation: "URL (typically GitHub) for code repository"
    },
    dataComment: {
        documentation: "Evaluator's notes about data",
        essential: 1
    },
    doi: {
        documentation: "DOI"
    },
    error: {
        documentation: "Set to an error string if needed"
    },
    hasBreach: {
        documentation: "Paper breaches journal code policy (see section~\\ref{supplementary-journal-policies-section})",
        flag: "$\\sf P_{{\\mbox{\\scriptsize c-breach}}}$" // how a flag will be abbreviated in the paper text
    },
    hasCodeInPrinciple: {
        documentation: "Paper says source code is available in principle",
        flag: "$\\sf S_p$"
    },
    hasCodePolicy: { // flag value set automatically from journal name
        documentation: "Journal has a code policy (see section~\\ref{supplementary-journal-policies-section})",
        flag: "$\\sf P_c$"
    },
    hasCodeRepo: {
        documentation: "Paper uses a code repository (e.g., GitHub)",
        flag: "$\\sf R_c$"
    },
    hasCodeTested: {
        documentation: "Evidence that source code has been run with a clean build and tested",
        flag: "$\\sf S_{\\mbox{\\scriptsize tested}}$"
    },
    hasDataRepo: {
        documentation: "Paper uses a data repository (e.g., Dryad, Figshare, GitHub)",
        flag: "$\\sf R_d$",
        dataFlag: 1 // this flag is for the data comment (defaults to code flag)
    },
    hasDevelopedRigorously: {
        documentation: "Evidence that source code was developed rigorously",
        flag: "$\\sf S_{{\\mbox{\\scriptsize rigorous}}}$"
    },
    hasDirectCode: {
        documentation: "Paper or URL provides source code",
        flag: "$\\sf S_{+}$"
    },
    hasEmptyRepo: {
        documentation: "Code repository contains no code",
        flag: "$\\sf R_{\\mbox{\\scriptsize c-empty}}$"
    },
    hasGoodComment: {
        documentation: "Helpful comments explaining code intent, rather than rephrasing the code",
        flag: "$\\sf C_2$"
    },
    hasNoCode: {
        documentation: "No code available at all (note: code is not expected for standard models, systems or statistical methods)",
        flag: "$\\sf S_{\\mbox{\\scriptsize NONE}}$"
    },
    hasNoComment: {
        documentation: "Code has no non-trivial comments",
        flag: "$\\sf C_0$"
    },
    hasOpenSourceDevelopment: {
        documentation: "Team or open source development",
        flag: "$\\sf S_{{\\mbox{\\scriptsize open source}}}$"
    },
    hasOtherTechniques: {
        documentation: "Other evidence of good practice; see details in summary table",
        flag: "$\\sf S_{{\\mbox{\\scriptsize otherSE}}}$"
    },
    hasRAP: {
        documentation: "Use of RAP/RAP* principles"
    },
    hasSubstantialcomment: {
        documentation: "Code has substantial, useful comments and documentation",
        flag: "$\\sf C_{+}$"
    },
    hasToolBasedDevelopment: {
        documentation: "Evidence of any tool-based development",
        flag: "$\\sf S_{{\\mbox{\\scriptsize tools}}}$"
    },
    hasTrivialComment: {
        documentation: "Code only has trivial comments (e.g., copyright)",
        flag: "$\\sf C_1$"
    },
    journal: {
        documentation: "Journal",
        essential: 1
    },
    number: {
        documentation: "Issue number or identifier",
        essential: 1
    },
    pages: {
        documentation: "Number of pages"
    },
    reference: {
        // unique reference number is automatically generated, but you can override it if you want to 
        // refer to a particular paper in the Latex papers
        documentation: "Internal Latex citation identifier (needs to be unique, which is checked)"
    },
    title: {
        documentation: "Title of paper",
        essential: 1
    },
    volume: {
        documentation: "Volume",
        essential: 1
    },
    year: {
        documentation: "Year published",
        essential: 1
    }
};

// data for the paper assessments
// NB as we know only Nature Digital Medicine has a code policy, that field is filled in automatically later
var data = [{
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Callahan A, Steinberg E, Fries JA, Gombar S, Patel B, Corbin CK, Shah NH",
        year: 2020,
        title: "Estimating the efficacy of symptom-based screening for COVID-19",
        volume: 3,
        number: 95,
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0300-0",
        dataComment: "On request",
        hasCodeInPrinciple: 1,
        codeComment: "``Code is available upon request from the corresponding author'' (requested)",
        pages: 3
    },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Kanzler CM, Rinderknecht MD, Schwarz A, Lamers I, Gagnon C, Held JPO, Feys P, Luft AR, Gassert R, Lambercy O",
        year: 2020,
        title: "A data-driven framework for selecting and validating digital health metrics: use-case in neurological sensorimotor impairments",
        volume: 3,
        number: "80",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0286-7",
        dataComment: "``The datasets used in the current study are available from the corresponding author upon reasonable request and under consideration of the ethical regulations''",
        hasDataRepo: 1,
        hasDirectCode: 1,
        hasCodeRepo: 1,
        codeURL: "github.com/ChristophKanzler/MetricSelectionFramework",
        hasTrivialComment: 1,
        codeComment: "Matlab. Documented overview, but only trivial comments",
        pages: 17
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Roy A, Nikolitch K, McGinn R, Jinah S, Klement W, Kaminsky ZA",
        year: 2020,
        title: "A machine learning approach predicts future risk to suicidal ideation from social media data",
        volume: 3,
        number: "78",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0287-6",
        dataComment: "``In accordance with Twitter policies of data sharing, data used in the generation of the algorithm for this study will not be made publicly available''",
        hasBreach: 1,
        codeComment: "``Due to the sensitive and potentially stigmatizing nature of this tool, code used for algorithm generation or implementation on individual Twitter profiles will not be made publicly available''",
        hasNoCode: 1,
        pages: 12
    },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Levine DM, Co Z, Newmark LP, Groisser AR, Holmgren AJ, Haas JA, Bates DW",
        year: 2020,
        title: "Design and testing of a mobile health application rating tool",
        volume: 3,
        number: "74",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0268-9",
        dataComment: "``The datasets generated during and/or analyzed during the current study are available from the corresponding author on reasonable request.''``''",
        hasCodeInPrinciple: 1,
        codeComment: "``This code would be made available upon reasonable request.'' (requested)",
        pages: 7
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Kannampallil T, Smyth JM, Jones S, Payne PRO, Ma J",
        year: 2020,
        title: "Cognitive plausibility in voice-based AI health counselors",
        volume: 3,
        number: "72",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0278-7",
        dataComment: "Nothing available",
        hasBreach: 1,
        hasNoCode: 1,
        codeComment: "Nothing available (despite building two voice-based virtual counselors)",
        pages: 4
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Huang S, Kothari T, Banerjee I,  Chute C, Ball RL, Borus N, Huang A, Patel BN, Rajpurkar P, Irvin J, Dunnmon J,  Bledsoe J, Shpanskaya K, Dhaliwal A, Zamanian R, Ng AY, Lungren MP",
        year: 2020,
        title: "PENet a scalable deep-learning model for automated diagnosis of pulmonary embolism using volumetric CT imaging",
        volume: 3,
        number: "61",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0266-y",
        dataComment: "``The datasets generated and analyzed during the study are not currently publicly available due to HIPAA compliance agreement but are available from the corresponding author on reasonable request''",
        hasDirectCode: 1,
        hasTrivialComment: 1,
        codeURL: "github.com/marshuang80/PENet",
        hasCodeRepo: 1,
        codeComment: "Poor commenting, no documentation",
        pages: 9
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Dhruva SS, Ross JS, Akar JG,  Caldwell B, Childers K, Chow W, Ciaccio L, Coplan P, Dong J, Dykhoff HJ, Johnston S, Kellogg T, Long C, Noseworthy PA, Roberts K, Saha A, Yoo A, Shah ND",
        year: 2020,
        title: "Aggregating multiple real-world data sources using a patient-centered health-data-sharing platform",
        volume: 3,
        number: "60",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0265-z",
        dataComment: "``The dataset generated and analyzed for this study will not be made publicly available due to patient privacy and lack of informed consent to allow sharing of patient data outside of the research team''",
        hasBreach: 1,
        hasNoCode: 1,
        codeComment: "No code available",
        pages: 9
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Hofer IS, Lee C, Gabel E, Baldi P, Cannesson M",
        year: 2020,
        title: "Development and validation of a deep neural network model to predict postoperative mortality, acute kidney injury, and reintubation using a single feature set",
        volume: 3,
        number: "58",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0248-0",
        dataComment: "``The datasets generated during and/or analyzed during the current study are not publicly available due to institutional restrictions on data sharing and privacy concerns. However, the data are available from the corresponding author on reasonable request''",
        hasCodeRepo: 1,
        hasBreach: 1,
        hasEmptyRepo: 1,
        hasNoCode: 1,
        codeURL: "github.com/cklee219/PostoperativeOutcomes_RiskNet",
        codeComment: "Empty GitHub repository: ``Code coming soon\\ldots'' it says",
        pages: 10
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Norgeot B, Muenzen K, Peterson TA, Fan X, Glicksberg BS, Schenk G, Rutenberg E, Oskotsky B, Sirota M, Yazdany J, Schmajuk G, Ludwig D, Goldstein T, Butte AJ",
        year: 2020,
        title: "Protected Health Information filter (Philter): accurately and securely de-identifying free-text clinical notes",
        volume: 3,
        number: "57",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0258-y",
        dataComment: "``The i2b2 data that support the findings of this study are available from i2b2 but restrictions apply to the availability of these data, which require signed safe usage and research-only. Data from UCSF are not available at this time as they have not been legally certified as being De-Identified, however, this process is underway and the data may be available by the time of publication by contacting the authors. Requesters identity as researchers will need to be confirmed, safe usage guarantees will need to be signed, and other restrictions may apply''",
        hasDirectCode: 1,
        hasTrivialComment: 1,
        codeURL: "github.com/BCHSI/philter-ucsf",
        hasCodeRepo: 1,
        codeComment: "Basic documentation, very little comment",
        pages: 8
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Choi D, Park JJ, Ali T, Lee S",
        year: 2020,
        title: "Artificial intelligence for the diagnosis of heart failure",
        volume: 3,
        number: "54",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0261-3",
        dataComment: "``Not available due to restrictions in the ethical permit, but may be available on request''",
        hasDirectCode: 1,
        hasTrivialComment: 1,
        codeURL: "github.com/ubiquitous-computing-lab/AI-CDSS-Cardiovascular-Silo",
        hasCodeRepo: 1,
        codeComment: " Trivial comments, no documentation",
        pages: 6
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "17 January 2021",
        authors: "Hilton CB, Milinovich A, Felix C, Vakharia N,  Crone T,  Donovan C, Proctor A, Nazha A",
        year: 2020,
        title: "Personalized predictions of patient outcomes during and after hospitalization using artificial intelligence",
        volume: 3,
        number: "51",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0249-z",
        dataComment: "``The data that support the findings of this study are available in a deidentified form from Cleveland Clinic, but restrictions apply to the availability of these data, which were used under Cleveland Clinic data policies for the current study, and so are not publicly available''",
        hasBreach: 1,
        hasNoCode: 1,
        codeComment: "``We used only free and open-source software'' some of which is unspecified",
        pages: 8
            },
    {
        accessed: "14 July 2020",
        doubleChecked: "19 January 2021",
        authors: "Li MD, Chang K, Bearce B, Chang BY, Huang AJ, Campbell JP, Brown JM, Singh P, Hoebel KV, Erdo{\\u g}mu\\c{s} D, Ioannidis S, Palmer W, Chiang MF, Kalpathy-Cramer J",
        year: 2020,
        title: "Siamese neural networks for continuous disease severity evaluation and change detection in medical imaging",
        volume: 3,
        number: "48",
        journal: "Nature Digital Medicine",
        doi: "10.1038/s41746-020-0255-1",
        dataComment: "``The i-ROP cohort study data for ROP is not publicly available due to patient privacy restrictions, though potential collaborators are directed to contact the study investigators \\ldots''",
        hasDirectCode: 1,
        hasTrivialComment: 1,
        codeURL: "github.com/QTIM-Lab/SiameseChange",
        hasCodeRepo: 1,
        codeComment: "Not all code on GitHub, minor comments",
        pages: 9
            },
    {
        accessed: "22 July 2020",
        authors: "Hoffman JI, Nagel R, Litzke V, Wells DA, Amos W",
        doubleChecked: "26 January 2021",
        year: 2020,
        title: "Genetic analysis of \\emph{Boletus edulis\\/} suggests that intra-specific competition may reduce local genetic diversity as a woodland ages",
        volume: 7,
        number: "200419",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200419",
        dataComment: "Data available on Dryad",
        hasDataRepo: 1,
        hasDirectCode: 1,
        hasSubstantialcomment: 1,
        codeURL: "datadryad.org/stash/dataset/doi:10.5061/dryad.1g1jwstrw",
        reference: "paper-usesRMarkdown",
        codeComment: "Code and example runs available in R Markdown",
        pages: 13
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Gr\\\"onquist P, Panchadcharam P, Wood D, Menges A, R\\\"uggeberg M, Wittel FK",
        year: 2020,
        title: "Computational analysis of hygromorphic self-shaping wood gridshell structures",
        volume: 7,
        number: "192210",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.192210",
        dataComment: "Data directly written into program code",
        hasTrivialComment: 1,
        hasDirectCode: 1,
        hasBreach: 1,
        codeComment: "Basic Matlab with routine comments",
        codeURL: "royalsocietypublishing.org/doi/suppl/10.1098/rsos.192210",
        pages: 9
            },
    {
        accessed: "22 July 2020",
        authors: "Amos W",
        doubleChecked: "26 January 2021",
        year: 2020,
        title: "Signals interpreted as archaic introgression appear to be driven primarily by faster evolution in Africa",
        volume: 7,
        number: "191900",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.191900",
        hasDataRepo: 1,
        dataComment: "Data available on Dryad plus publicly available data from the 1000 genomes project. Currently (apparently) for private view",
        hasCodeInPrinciple: 1,
        hasOtherTechniques: 1,
        hasGoodComment: 1,
        codeComment: "Code available for private view, though some code available with minor comments. Paper describes using two contrasting methods to help confirm correctness, ``As an additional check, I also coded the calculation of D based on a probabilistic approach, using genotype frequencies in each population to calculate the expected frequencies of each possible two-genotype combination (electronic supplementary material, table S1). Essentially identical results were obtained.'' but the contrasting method is not available",
        codeURL: "datadryad.org/stash/share/ichHKrWj7hqlznOaR6NQVzITgp40dlqWvWAgAxyafiQ",
        pages: 9,
        reference: "onlyPaperWithChecks"
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Gordon M, Viganola D, Bishop M, Chen Y, Dreber A, Goldfedder B, Holzmeister F, Johannesson M, Liu Y, Twardy C, Wang J, Pfeiffer T",
        year: 2020,
        title: "Are replication rates the same across academic fields? Community forecasts from the DARPA SCORE programme",
        volume: 7,
        number: "200566",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200566",
        hasDataRepo: 1,
        dataComment: "Data available on Dryad",
        hasCodeInPrinciple: 1,
        hasGoodComment: 1,
        codeURL: "royalsocietypublishing.org/doi/suppl/10.1098/rsos.200566",
        codeComment: "Reasonaby commented code on Dryad, but code is not complete and presumably never checked",
        pages: 7
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Evans D, Field AP",
        year: 2020,
        title: "Predictors of mathematical attainment trajectories across the primary-to-secondary education transition: parental factors and the home environment",
        volume: 7,
        number: "200422",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200422",
        dataComment: "On request",
        hasCodeInPrinciple: 1,
        hasTrivialComment: 1,
        codeURL: "osf.io/a5xsz/?view_only=87ae173f775b40d79d6cd0fdcf6d4a9c",
        codeComment: "R lightly commented",
        pages: 20
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        reference: "ethics-paper",
        authors: "Beale N, Battey H, Davison AC, MacKay RS",
        year: 2020,
        title: "An unethical optimization principle",
        volume: 7,
        number: "200462",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200462",
        dataComment: "No data required",
        hasCodeInPrinciple: 1,
        hasBreach: 1,
        codeComment: "Unrunnable incomplete code fragment",
        pages: 11
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Cherevko AA, Gologush TS, Petrenko IA, Ostapenko VV, Panarin VA",
        year: 2020,
        title: "Modelling of the arteriovenous malformation embolization optimal scenario",
        volume: 7,
        number: "191992",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.191992",
        dataComment: "Data embedded in PDF",
        hasBreach: 1,
        hasNoCode: 1,
        codeComment: "No code available",
        pages: 16
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Soczawa-Stronczyk AA, Bocian M",
        year: 2020,
        title: "Gait coordination in overground walking with a virtual reality avatar",
        volume: 7,
        number: "200622",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200622",
        dataComment: "Data available on Dryad",
        hasDataRepo: 1,
        hasCodeInPrinciple: 1,
        hasGoodComment: 1,
        codeURL: "datadryad.org/stash/dataset/doi:10.5061/dryad.vx0k6djnr",
        codeComment: "Some comments, some code in Matlab",
        pages: 19
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Duruz S, Vajana E, Burren A, Flury C, Joost S",
        year: 2020,
        title: "Big dairy data to unravel effects of environmental, physiological and morphological factors on milk production of mountain-pastured Braunvieh cows",
        volume: 7,
        number: "200638",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200638",
        dataComment: "Partial data on Dryad ",
        hasDataRepo: 1,
        hasDirectCode: 1,
        hasSubstantialcomment: 1,
        hasCodeRepo: 1,
        codeURL: "github.com/SolangeD/lactModel",
        codeComment: "Documented R, including manual",
        pages: 13
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "de Azevedo EZD, Dantas DV, Daura-Jorge FG",
        year: 2020,
        title: "Risk tolerance and control perception in a game-theoretic bioeconomic model for small-scale fisheries",
        volume: 7,
        number: "200621",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200621",
        dataComment: "No data required",
        hasBreach: 1,
        hasNoCode: 1,
        codeComment: "``We constructed a bioeconomic model for an RSSF [restricted fishing effort small-scale fishery] using game theory'' for which results are discussed, yet no code is available",
        pages: 11
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Abdolhosseini-Qomi AM, Jafari SH, Taghizadeh A, Yazdani N, Asadpour M, Rahgozar M",
        year: 2020,
        title: "Link prediction in real-world multiplex networks via layer reconstruction method",
        volume: 7,
        number: "191928",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.191928",
        dataComment: "Data cited, not all available",
        hasDirectCode: 1,
        hasTrivialComment: 1,
        codeURL: "github.com/UT-NSG/LRM",
        hasCodeRepo: 1,
        codeComment: "Trivial documentation",
        pages: 22
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Webster J, Amos M",
        year: 2020,
        title: "A Turing test for crowds",
        volume: 7,
        number: "200307",
        reference: "example-numerical-error",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200307",
        hasDataRepo: 1,
        dataComment: "On Figshare",
        codeURL: "figshare.com/collections/Supplementary_information_for_Webster_J_and_Amos_M_A_Turing_Test_for_Crowds_/4859118/1",
        hasDirectCode: 1,
        hasTrivialComment: 1,
        codeComment: "On Figshare, large amount of disorganised and undocumented code. Helpful features to make usable for third parties",
        pages: 12
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Zhu Y-l, Wang C-J, Gao F, Xiao Z-x, Zhao P-l, Wang J-y",
        year: 2020,
        title: "Calculation on surface energy and electronic properties of CoS${}_2$",
        volume: 7,
        number: "191653",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.191653",
        dataComment: "Data on Dryad",
        hasBreach: 1,
        hasDataRepo: 1,
        hasNoCode: 1,
        codeComment: "No code available",
        pages: 12
            },
    {
        accessed: "22 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Yu B, Scott CJ, Xue X, Yue X, Dou X",
        year: 2020,
        title: "Derivation of global ionospheric Sporadic E critical frequency ($f_o$Es) data from the amplitude variations in GPS/GNSS radio occultations",
        volume: 7,
        number: "200320",
        journal: "Royal Society Open Science",
        volume: 7,
        doi: "10.1098/rsos.200320",
        dataComment: "Data on various web sites",
        hasBreach: 1,
        hasNoCode: 1,
        codeComment: "No code available",
        pages: 15,
            },
    {
        accessed: "24 July 2020",
        doubleChecked: "26 January 2021",
        authors: "Joon-myoung K, Younghoon C, Ki-Hyun J, Soohyun C, Kyung-Hee K, Seung D B, Soomin J, Jinsik P, Byung-Hee O",
        year: 2020,
        title: "A deep learning algorithm to detect anaemia with ECGs: a retrospective, multicentre study",
        volume: 2,
        number: "7",
        journal: "Lancet Digital Health",
        pages: "e358--67",
        doi: "10.1016/S2589-7500(20)30108-4",
        hasNoCode: 1,
        dataComment: "Data on request",
        codeComment: " ``The coding used to train the artificial intelligence model are dependent on annotation, infrastructure, and hardware, so cannot be released.'' (!) Algorithm (not source code) available on request.",
        pages: 9
            },
    {
        accessed: "24 July 2020",
        authors: "Zhu H, Cheng C, Yin H, Li X, Zuo P, Ding J, Lin F, Wang J, Zhou B, Li Y, Hu S, Xiong Y, Wang B, Wan G, Yang X, Yuan Y",
        doubleChecked: "26 January 2021",
        year: 2020,
        title: "Automatic multilabel electrocardiogram diagnosis of heart rhythm or conduction abnormalities with deep learning: a cohort study",
        volume: 2,
        number: "7",
        journal: "Lancet Digital Health",
        pages: "e348--57",
        doi: "10.1016/S2589-7500(20)30107-2",
        dataComment: "Data on request",
        hasCodeInPrinciple: 1,
        codeComment: "Python scripts can be requested",
        pages: 9
            },
    {
        accessed: "24 July 2020",
        authors: "Fung R, Villar J, Dashti A, Ismail LC, Staines-Urias E, Ohuma EO, Salomon LJ, Victora CG, Barros FC, Lambert A, Carvalho M, Jaffer Y A, Noble JA, Gravett MG, Purwar M, Pang R, Bertino E, Munim S, Min AM, McGready R, Norris SA, Bhutta ZA, Kennedy SH, Papageorghiou AT, Ourmazd A",
        doubleChecked: "26 January 2021",
        year: 2020,
        title: "Achieving accurate estimates of fetal gestational age and personalised predictions of fetal growth based on data from an international prospective cohort study: a population-based machine learning study",
        volume: 2,
        number: "7",
        journal: "Lancet Digital Health",
        pages: "e368--75",
        doi: "10.1016/S2589-7500(20)30131-X",
        dataComment: "Unspecified location on large website requiring registration",
        hasDataRepo: 1,
        hasDirectCode: 1,
        hasCodeRepo: 1,
        hasTrivialComment: 1,
        codeURL: "github.com/ki-analysis/manifold-ga",
        codeComment: "Has overall documentation but poorly commented Matlab code on GitHub",
        pages: 7
            },
    {
        accessed: "24 July 2020",
        authors: "Sabanayagam C, Xu D, Ting DSW, Nusinovici S, Banu R, Hamzah H, Lim C, Tham Y-C, Cheung CY, Tai ES, Wang XY, Jonas JB,  Cheng C-Y, Lee ML, Hsu W, Wong TY",
        doubleChecked: "26 January 2021",
        year: 2020,
        title: "A deep learning algorithm to detect chronic kidney disease from retinal photographs in community-based populations",
        volume: 2,
        number: "7",
        journal: "Lancet Digital Health",
        pages: "e295--302",
        doi: "10.1016/S2589-7500(20)30063-7",
        dataComment: "Available to researchers who meet criteria for access to confidential data",
        hasNoCode: 1,
        codeComment: "Despite the paper being a ``deep learning algorithm'' the code is not available",
        pages: 7
            },
    {
        accessed: "24 July 2020",
        doubleChecked: "27 January 2021",
        authors: "Monteiro M, Newcombe VF, Mathieu F, Adatia K, Kamnitsas K, Ferrante E, Das T, Whitehouse D, Rueckert D, Menon DK, Glocker B",
        year: 2020,
        title: "Multiclass semantic segmentation and quantification of traumatic brain injury lesions on head CT using deep learning: an algorithm development and multicentre validation study",
        volume: 2,
        number: "7",
        journal: "Lancet Digital Health",
        pages: "e314--22",
        doi: "10.1016/S2589-7500(20)30085-6",
        dataComment: "Data access conditional on approved study proposal",
        hasDirectCode: 1,
        hasCodeRepo: 1,
        hasNoComment: 1,
        codeURL: "github.com/biomedia-mira/blast-ct",
        codeComment: "Almost completely uncommented Python, but does have a basic setup script",
        pages: 8
            },
    {
        accessed: "24 July 2020",
        doubleChecked: "27 January 2021",
        authors: "Liu K-L, Wu T, Chen P-T, Tsai Y M, Roth H, Wu M-S, Liao W-C, Wang W",
        year: 2020,
        title: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
        volume: 2,
        number: "7",
        journal: "Lancet Digital Health",
        pages: "e303--13",
        doi: "10.1016/S2589-7500(20)30078-9",
        dataComment: "Unspecified locations on several large websites",
        hasNoCode: 1,
        codeComment: "Python used and apparently GitHub, but --- an oversight? --- no code is available",
        pages: 10
    }];

function definedq(x) {
    return x != undefined && x != "undefined"
}

var fs = require('fs');
var buffer;

var countSaveFile = 0;

function saveFile(fileName, buffer, description) {
    fs.open(fileName, 'w', function (err, fd) {
        if (err) {
            if (err.code === 'EEXIST') {
                console.error(fileName + " can't be over-written");
                return;
            }
            console.error("Some error trying to write " + fileName);
            throw err;
        }
        fs.writeFileSync(fd, buffer, function (err) {
            if (err) {
                return console.log("Saving " + fileName + " got error: " + err);
            }
        })
        if (countSaveFile++ == 0) console.log("\nSummary of files generated from JSON data in file data.js");
        console.log("   " + countSaveFile + ". " + fileName + " - " + description);
    });
}

// what does the data look like -- used in the appendix?
// this is done now, before the checking fills up all the default field entries
var countFields = 0;
for (var i in descriptionsOfFields)
    countFields++;

s = "\\def\\countFields{" + countFields + "}\n\\noindent\\texttt{\n\\hspace*{\\codeIndent}\\{";
var sep = "\\hspace*{\\codeIndent}";
var chosen = data[0];
const maxlength = 40;
for (i in chosen) {
    s += sep + "\\newline\n\\hspace*{2\\codeIndent} " + i + ": ";
    if (typeof chosen[i] == "string") {
        s += "\"";
        for (j = 0; j < Math.min(maxlength, chosen[i].length); j++)
            s += chosen[i].charAt(j);
        s += chosen[i].length > maxlength ? " \\ldots" : "\"";
    } else s += chosen[i];
    sep = ",";
}
s += "\\newline\n\\hspace*{\\codeIndent}\\}\n}\n";
saveFile("generated-example-data.tex", s, "LaTeX example of JSON data");

//--------------------

function isFalse(field) { // returns 0 or 1
    return (!definedq(field) || field == "" || field == 0) ? 1 : 0;
}

function isTrue(field) { // returns 0 or 1
    return isFalse(field) ? 0 : 1;
}

var fields = [];

for (var i = 0; i < data.length; i++) {
    for (var j in data[i]) {
        if (!fields.includes(j))
            fields.push(j);
    }
}
fields.sort();

// sanity checks and warnings ...
var where = "";
var nowhere = "      "; // reset where once first error reported
var errorCount = 0; // report total at end of run...
var warnCount = 0; // report total at end of run...

function error(i, s) { // i is the data entry, so we can record the error in the data[i].error field for later
    if (i < 0) where = nowhere;
    console.log(where + s);
    where = nowhere;
    errorCount++;
    if (i >= 0)
        data[i].error += s + "<br/>";
}

function warn(i, s) { // i is the data entry, so we can record the error in the data[i].error field for later
    if (i < 0) where = nowhere;
    console.log(where + s);
    where = nowhere;
    warnCount++;
    if (i >= 0)
        data[i].warn += s + "<br/>";
}

// before any errors are reported, make sure error field is defined
for (var i = 0; i < data.length; i++) {
    if (!definedq(data[i].error))
        data[i].error = ""; // empty error (so far:-)
}

// check all the fields in the data are defined in descriptionsOfFields
var validfields = [];
for (var f in descriptionsOfFields) {
    validfields.push(f);
    descriptionsOfFields[f].usage = 0;
}

// fill in and check journal code policy defaults
for (var i = 0; i < data.length; i++) {
    // it's unlikely to have an error field, but create one for later use (if necessary)
    var cp;
    if (data[i].journal == "Nature Digital Medicine")
        cp = 1;
    else if (data[i].journal == "Royal Society Open Science")
        cp = 1;
    else if (data[i].journal == "Lancet Digital Health")
        cp = 0;
    else
        error(i, "** Unknown journal '" + data[i].journal + "' ... does it have a code policy?");
    if (!definedq(data[i].hasCodePolicy))
        data[i].hasCodePolicy = cp;
    else if (data[i].hasCodePolicy != cp)
        error(i, "** Code policy of '" + data[i].journal + "' seems wrong - should it be " + cp + "?");
}

// fix missing references to be unique (hopefully:-) - we'll double check below
for (var i = 0; i < data.length; i++)
    if (!definedq(data[i].reference))
        data[i].reference = "ref-" + (i + 1);

var referenceIDs = []; // to check references are unique

// now check each entry....
for (var i = 0; i < data.length; i++) {
    var d = data[i];

    var originalErrorCount = errorCount; // check to see if errorCount is increased during loop
    // note: Javascript counts array indices from 0, humans from 1 (!) hence i+1 below
    where = "** Error in DOI http://doi.org/" + d.doi + "\n   JSON data entry no " + (i + 1) + "\n   title: \"" + d.title + "\"\n   authors: \"" + d.authors + "\"\n      ";
    // are there missing essential fields?
    for (var f in descriptionsOfFields) {
        if (isTrue(descriptionsOfFields[f].essential) && isFalse(d[f])) {
            error(i, "Field " + f + " is missing or unset");
        }
    }

    // check code
    if (isTrue(d.hasDirectCode) + isTrue(d.hasCodeInPrinciple) + isTrue(d.hasNoCode) != 1)
        error(i, "Exactly one of hasDirectCode, hasCodeInPrinciple, hasNoCode must be set");
    var hasVisibleCode = (d.hasCodeRepo && !d.hasEmptyRepo) || d.hasDirectCode;
    if (d.hasSubstantialcomment + d.hasTrivialComment + d.hasNoComment > 1)
        error(i, "Can only have at most one of hasSubstantialcomment, hasTrivialComment and d.hasNoComment set");
    if (hasVisibleCode) {
        if (!(d.hasGoodComment || d.hasSubstantialcomment || d.hasTrivialComment || d.hasNoComment))
            error(i, "If it has code, it must have type of comment information set");
        if (isTrue(d.hasNoCode))
            error(i, "Can't have hasNoCode if any code flag is set");
    } else if (isTrue(d.hasOpenSourceDevelopment))
        error(i, "How can you have team or open source development without any code?");
    if (isFalse(hasVisibleCode) && (d.hasCodeTested || d.hasDevelopedRigorously))
        error(i, "Can only have hasCodeTested, or hasDevelopedRigorously set if it has visible code");
    if (isFalse(hasVisibleCode) && d.hasDevelopedRigorously)
        error(i, "Can really only have hasDevelopedRigorously if it has visible code");
    if (isFalse(hasVisibleCode) && isFalse(d.hasNoCode) && isFalse(d.hasCodeInPrinciple)) {
        error(i, "Must have hasNoCode or hasCodeInPrinciple set if no other code flag set");
    }
    if (isTrue(d.hasCodeInPrinciple)) {
        if (isTrue(d.hasCodeRepo))
            error(i, "Probably can't have 'code in principle' when there's a code repository");
        if (isTrue(d.hasDirectCode))
            error(i, "Can't have 'code in principle' and be accessible by URL");
    }
    if (isFalse(d.codeURL) && isTrue(hasVisibleCode))
        error(i, "If it has code or a repo, it needs a codeURL")

    // check comments
    var hasComments = isTrue(d.hasGoodComment) + isTrue(d.hasSubstantialcomment) + isTrue(d.hasTrivialComment);
    if (isTrue(d.hasNoComment) && isTrue(hasComments))
        error(i, "Can't have comments and no comments");
    if (isFalse(hasVisibleCode) && isTrue(d.hasNoComment) && isTrue(hasComments))
        error(i, "If there is code, it must either have some comments or no comments");
    if (hasComments + isTrue(d.hasNoComment) > 1)
        error(i, "Can't have more than one type of comment");
    if (isTrue(d.hasGoodComment) || isTrue(d.hasSubstantialcomment) || isTrue(d.hasTrivialComment) || isTrue(d.hasNoComment)) {
        if (isFalse(d.hasCodeRepo) && isFalse(d.hasDirectCode) && isFalse(d.hasCodeInPrinciple))
        // code may have been available if hasCodeInPrinciple...
            error(i, "Can't have comment information if it has no code");
    }

    // check repos
    if (isTrue(d.hasEmptyRepo) && isFalse(d.hasCodeRepo))
        error(i, "Can't have an empty repo without a repo to be empty");

    // journal policies
    if (isTrue(d.hasBreach) && isFalse(d.hasCodePolicy))
        error(i, "Can't have a journal policy breach without a policy");

    // reference codes
    if (referenceIDs.includes(d.reference))
        error(i, "Duplicate reference number: " + d.reference);
    referenceIDs.push(d.reference);

    if (originalErrorCount < errorCount && isTrue(d.doubleChecked)) {
        error(i, "*** Errors found in an entry that has been double checked");
        errorCount--; // hack as error() will have incremented a repeat error warning!
    }

    // are there fields that shouldn't be there?
    for (var f in d) {
        if (!validfields.includes(f))
            error(i, "Data field " + f + " isn't a defined field name");
        else
            descriptionsOfFields[f].usage++;
    }
    for (var f in descriptionsOfFields) { // ensure remaining missing fields (we've already checked for essential fields) are set to 0 (aka false)
        if (isFalse(d[f]))
            d[f] = "";
    }
}

for (var f in descriptionsOfFields)
    if (descriptionsOfFields[f].usage <= 0)
        warn(-1, "** Warning: field " + f + " never used in data; default value used");

    // flags make more sense to the reader if they appear in this related order...
var flagOrder = ["hasCodePolicy",
    "hasBreach",
    "hasCodeRepo",
    "hasEmptyRepo",
    "hasDataRepo",
    "hasNoCode",
    "hasCodeInPrinciple",
    "hasDirectCode",
    "hasDevelopedRigorously",
    "hasCodeTested",
    "hasToolBasedDevelopment",
    "hasOpenSourceDevelopment",
    "hasOtherTechniques",
    "hasNoComment",
    "hasTrivialComment",
    "hasGoodComment",
    "hasSubstantialcomment"
                ];

// check all flags in descriptionsOfFields are in flagOrder,
for (var i in descriptionsOfFields)
    if (definedq(descriptionsOfFields[i].flag) && !flagOrder.includes(i))
        error(-1, "** flag " + i + " is not in flagOrder[]");

    // check all flags in flagOrder are in descriptionsOfFields
for (var i = 0; i < flagOrder.length; i++) {
    var f = flagOrder[i];
    if (!definedq(descriptionsOfFields[f]))
        console.log("** " + f + " not defined in in descriptionsOffields");
    else if (!definedq(descriptionsOfFields[f].flag))
        console.log("** " + f + " defined in descriptionsOffields but does not have a flag string set");
}

// have any flags not been used?
// are there any flags that aren't defined?

// tidy up flag values 
for (var i = 0; i < data.length; i++) {
    for (var k = 0; k < fields.length; k++) {
        var j = fields[k];
        if (j == "hasCodeTested") console.log("1" + data[i][j]);
        if (!definedq(typeof data[i][j]) || !definedq(data[i][j])) // undefined flags become zero (ie unset), other fields become empty strings, ""
            data[i][j] = flagOrder.includes(j) ? 0 : "";
        var isString = (typeof (data[i][j])) == "string";
        if (isString) data[i][j] = data[i][j].trim();
        if (j == "hasCodeTested") console.log("2" + data[i][j]);

    }
}

// generate Mathematica code for checking e.g., theorem discovery...
s = "(* We don't put all the fields into this Mathematica notebook - it's easy enough to fix if you want more :-) *)\n\n";
s += "latexFlags=<|";
var prefixA = "";
for (var f = 0; f < flagOrder.length; f++) {
    s += prefixA + "\"" + flagOrder[f] + "\"->\"" + descriptionsOfFields[flagOrder[f]].flag.replace(/\\/g, "\\\\") + "\"";
    prefixA = ",";
}
s += "|>;\ndata={";
prefixA = "";
for (var i = 0; i < data.length; i++) {
    var d = data[i];
    s += prefixA + "<|\"n\"->" + (i + 1) + ",";
    const interestingFields = ["doi", "authors", "accessed", "doubleChecked"];
    for (var j = 0; j < interestingFields.length; j++)
        s += "\"" + interestingFields[j] + "\"->\"" + d[interestingFields[j]].replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\",";

    var prefixB = "";
    for (var f = 0; f < flagOrder.length; f++) {
        s += prefixB + "\"" + flagOrder[f] + "\"->" + (isTrue(d[flagOrder[f]]) ? "True" : "False");
        prefixB = ",";
    }
    prefixA = ",\n  ";
    s += "|>";
}
s += "};\nvars=Keys[latexFlags];\n";
saveFile("generated-flagData.nb", s, "Flags expressed as Mathematica code");

// check that all flags have a flag string, and all flag strings are in this flagOrder list
for (var i = 0; i < flagOrder.length; i++) {
    var f = descriptionsOfFields[flagOrder[i]];
    if (!definedq(f) || f == "")
        error(-1, "** flag " + flagOrder[i] + " has no corresponding flag string");
}

for (var i in descriptionsOfFields) {
    var f = descriptionsOfFields[i].flag;
    if (definedq(f))
        if (!flagOrder.includes(i))
            error(-1, "** flag " + i + " is not a valid flag (see the flagOrder array)");
}

var s = "";

// generate a CSV file
function csvise(s, last) {
    return "\"" + (s + "").replace(/"/g, "\"\"") + "\"" + (last ? "\n" : ",");
}

s = "";
var lastflag;
for (var f in descriptionsOfFields)
    lastflag = f;
for (var f in descriptionsOfFields)
    s += csvise(descriptionsOfFields[f].documentation, f == lastflag);
for (var f in descriptionsOfFields)
    s += csvise("JSON field: " + f, f == lastflag);
for (var i = 0; i < data.length; i++) {
    for (var f in descriptionsOfFields)
        s += csvise(data[i][f], f == lastflag);
}
saveFile("CSV-generated-data.csv", s, "All data from data.js expressed in CSV for convenience");

s = "";
var spagelengths = "";
var srepos = "";
var n = 0,
    totalpagelengths = 0,
    gitpagelengths = 0;
for (var i = 0; i < data.length; i++) {
    var d = data[i],
        basename;
    totalpagelengths += d.pages;
    if (d.hasCodeRepo) {
        n++;
        var basename = d.codeURL.replace(/.*\/([^/]*)$/, "$1");
        srepos += "\\expandafter\\def\\csname " + basename.replace(/_/g, ".") + "\\endcsname{" + d.reference + "}\n";
        basename = "git-" + basename;
        s += "rm -rf \"" + basename + "\"\ngit clone \"http://" + d.codeURL + "\" \"" + basename + "\"\n\n";
        spagelengths += "\\expandafter\\def\\csname pagelength-" + basename.replace(/git-/, "").replace(/_/g, ".") + "\\endcsname{" + d.pages + "}\n";
        gitpagelengths += d.pages;
    }
}
s += "( echo \"% date generated by running generated-allGitRepos.sh downloading Git repos\";\n" +
    "echo \\\\\\\\def\\\\\\\\clonedate {\\\\\\\\ignorespaces `date \"+%e %B %Y\"`}\n" +
    "echo \\\\\\\\\def\\\\\\\\cloneyear {`date \"+%Y\"`}\n" +
    "echo \\\\\\\\def\\\\\\\\clonemonth {`date \"+%m\"`}\n" +
    ") > ../generated-clone-date.tex\n";

// variables to be defined in file generated-metadata.tex by running the shell script

s += "\n(echo % shell-script calculated metavariables; echo \"\\\\\\newcount \\\\\\JSONerrorCount\";"; // newcounts on separate lines so they are counted correctly by wc -l
s += "echo \"\\\\\\newcount \\\\\\dataVariableCount\") > ../generated-metadata.tex\n"

// count of errors to \JSONerrorCount
s += "\n# how many errors can data.js find?\necho \"\\\\\\JSONerrorCount =\" `grep \"error(\" ../data.js|wc -l` >> ../generated-metadata.tex\n";

// count of variables (number registers plus macro definitions) to \JSONvariableCount
s += "\n# how many variables does data.js define?\necho \"\\\\\\dataVariableCount =\" >> ../generated-metadata.tex\n";
s += "egrep \"(newcount)|(\\\\\\\\def)\" ../data.js|wc -l >> ../generated-metadata.tex\n";
// unfortunately that count will be one too high as it counts the line above as well!
s += "echo \"\\\\\\advance \\\\\\dataVariableCount by -1\" >> ../generated-metadata.tex\n";

saveFile("generated-allGitRepos.sh", s, "Shell script to download all available " + n + " GitHub repositories \n         generated-clone-date.tex - Running the shell script also saves download date of GitHub clones\n         generated-metadata.tex - shell-script generated LaTeX variable values")
    //console.log(spagelengths);
spagelengths += "\\newcount \\gitPages \\gitPages=" + gitpagelengths + "\n";
spagelengths += "\\newcount \\totalPages \\totalPages=" + totalpagelengths + "\n";
saveFile("generated-page-lengths.tex", spagelengths, "Page lengths, total and total of papers with Git repositories")

// generate the LaTeX assessment summary table
s = "";
const flagSpacing = "\\hskip 3pt{}";
for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var codeFlags = " ";
    var documentFlags = " ";
    for (var j = 0; j < flagOrder.length; j++) {
        var flag = flagOrder[j];
        if (definedq(descriptionsOfFields[flag].flag) && d[flag])
            if (isTrue(descriptionsOfFields[flag].dataFlag))
                documentFlags += descriptionsOfFields[flag].flag + flagSpacing;
            else
                codeFlags += descriptionsOfFields[flag].flag + flagSpacing;
    }
    documentFlags = "\\flagStyle{" + documentFlags + "}";
    codeFlags = "\\flagStyle{" + codeFlags + "}";
    s += "\\citenum{" + (d.reference == "reference" && typeof (d.reference) == "number" ? "R" : "") + d.reference + "} & " + d.dataComment + documentFlags + " & " + d.codeComment + codeFlags + "\\\\\n";
}
saveFile("generated-assessments.tex", s, "Main summary table for Supplementary Material");

function fixAuthors(s) {
    const maxAuthors = 1000; // put et al after nth author (eg if maxAuthors=3, at most 3 explicit authors)
    var a = s.split(",");
    var fa = "";
    var prefix = "";
    for (var i = 0; i < a.length; i++) {
    	a[i] = a[i].trim();
	    // a[i] is in the format: Kaminsky ZA
		// we change it to {\sc Z. A. Kaminsky}
        fa += prefix;
        var lastSpace = a[i].length-1; 
        while( lastSpace >= 0 && a[i].charAt(lastSpace) != " " ) lastSpace--;
        for( var k = lastSpace+1; k < a[i].length; k++ )
        {	fa += a[i].charAt(k);
        	if( a[i].charAt(k+1) == "-" ) { 
				fa += a[i].charAt(++k);
        		continue;
			}
			fa +=  ". ";
        }
		for( var k = 0; k < lastSpace; k++ )
        	fa += a[i].charAt(k);
        prefix = ", ";
        if (i + 1 >= maxAuthors && i + 1 < a.length) {
            fa += ", \\emph{et al}";
            break;
        }
        if (i == a.length - 2)
            prefix = ", and ";
    }
    return "{\\sc "+ fa + "}";
}

// generate bibliography for assessments
s = "";
for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var basename = d.codeURL.replace(/.*\/([^/]*)$/, "$1").replace(/_/g, ".").trim();
    s += "\\vbox{";
    if (basename.length > 0) s += "\\maprepo{" + basename + "}";
    s += "\\bibitem{" + d.reference + "}\n" + fixAuthors(d.authors) + ", ``" + d.title + ",'' \\emph{" + d.journal + "}, \\textbf{" + d.volume + "}";
    if (definedq(d.number)) s += "(" + d.number + ")";
    if (definedq(d.pages) && d.pages != 0) s += ":" + d.pages + "pp";
    s += ", ";
    s += d.year + ". DOI \\texttt{" + d.doi.trim() + "}" + (d.codeURL != undefined && d.codeURL != "" ? (" {Code \\url{" + d.codeURL.trim() + "}}") : "") + "\\\\\\hfill{Accessed " + d.accessed + ".}\\ " + (!definedq(d.doubleChecked) || d.doubleChecked == "" ? "\\textcolor{red}{Not double-checked}" : ("{" +
        "Double-checked " + d.doubleChecked + "}")) + ".}\\bibskip\n\n";
}
saveFile("generated-supplementary-references.tex", s, "Reference list for Supplementary Material");

// generate summary table
var t = {};
t.hasBreach = 0;
t.hasCodeInPrinciple = 0;
t.hasDirectCode = 0;
t.hasDataRepo = 0;
t.hasCodeRepo = 0;
t.hasEmptyRepo = 0;
t.hasNoCode = 0;
t.hasGoodComment = 0;
t.hasTrivialComment = 0;
t.hasSubstantialcomment = 0;
t.hasCodePolicy = 0;
t.hasCodeTested = 0;
t.hasDevelopedRigorously = 0;
t.hasToolBasedDevelopment = 0;
t.hasOtherTechniques = 0;
t.hasOpenSourceDevelopment = 0;
t.hasRAP = 0;

for (var i = 0; i < data.length; i++) { // calculate totals
    for (var j in t)
        if (isTrue(data[i][j])) t[j] += 1;
}

var N = data.length;
console.log("Total number of papers assessed = " + N + "\n");

for (var j in t)
    console.log("    " + j + " = " + t[j] + "\n        " + descriptionsOfFields[j].documentation + "\n");

function percent(n, outOf) {
    var r = Math.round(100 * n / outOf);
    return n + "&" + r + "\\%";
}

function NandPercent(n, outOf) {
    var r = Math.round(100 * n / outOf);
    return "{" + n + "}&{" + r + "\\%}";
}

function changeNandPercent(n, outOf) {
    var r = Math.round(100 * n / outOf);
    return "{\\begin{change}" + n + "\\end{change}}&{\\begin{change}" + r + "\\%\\end{change}}";
}

t.hasNoProperComments = N - t.hasGoodComment;

s = "\\begin{tabular}{|rrrc|}\\hline\n";
s += "Number of papers sampled relying on code&" + N + "&100\\%&\\\\\\hline\\hline\n";

s += "\\multicolumn{4}{|l|}{\\textbf{Access to code}}\\\\\n";
s += "Have some or all code available&" + percent(t.hasDirectCode, N) + "&\\\\\n";
s += "Some or all code in principle available on request&" + percent(t.hasCodeInPrinciple, N) + "&\\\\\n";
s += "No code available&" + percent(t.hasNoCode, N) + "&\\\\\\hline\n";

s += "\\multicolumn{4}{|l|}{{\\textbf{Evidence of basic good software engineering practice}}}\\\\\n";
s += "Evidence program designed rigorously&" + NandPercent(t.hasDevelopedRigorously, N) + "&\\\\\n";
s += "Evidence source code properly tested&" + NandPercent(t.hasCodeTested, N) + "&\\\\\n";
s += "\\begin{change}Evidence of any tool-based development\\end{change}&" + changeNandPercent(t.hasToolBasedDevelopment, N) + "&\\\\\n";
s += "\\begin{change}Team or open source based development\\end{change}&" + changeNandPercent(t.hasOpenSourceDevelopment, N) + "&\\\\\n";
s += "Other methods, e.g., independent coding methods&" + NandPercent(t.hasOtherTechniques, N) + "&\\\\\\hline\n";

s += "\\multicolumn{4}{|l|}{\\textbf{Documentation and comments}}\\\\\n";
s += "Substantial code documentation and comments&" + percent(t.hasSubstantialcomment, N) + "&\\\\\n";
s += "Comments explain some code intent&" + percent(t.hasGoodComment, N) + "&\\\\\n";
s += "Procedural comments (e.g., author, date, copyright)&" + percent(t.hasTrivialComment, N) + "&\\\\\n";
s += "No usable comments&" + percent(N - t.hasTrivialComment - t.hasGoodComment - t.hasSubstantialcomment, N) + "&\\\\\\hline\n";

s += "\\multicolumn{4}{|l|}{\\textbf{Repository use}}\\\\\n";
s += "Code repository (e.g., GitHub) --- " + t.hasEmptyRepo + (t.hasEmptyRepo == 1 ? " was" : " were") + " empty&" + percent(t.hasCodeRepo, N) + "&\\\\\n";
s += "Data repository (e.g., Dryad or GitHub)&" + percent(t.hasDataRepo, N) + "&\\\\\\hline\n";

s += "\\multicolumn{4}{|l|}{{\\textbf{Evidence of automated processes}}}\\\\\n";
s += "Evidence of RAP/\\RAPstar\\ or similar principles in use&" + NandPercent(t.hasRAP, N) + "&\\\\\\hline\n";


s += "\\multicolumn{4}{|l|}{\\textbf{Adherence to journal code policy (if any)}}\\\\\n";
s += "Papers published in journals with code policies&" + percent(t.hasCodePolicy, N) + "&\\\\\n";
s += "Clear breaches of code policy (if any) & " + percent(t.hasBreach, t.hasCodePolicy) + "&($N=" + t.hasCodePolicy + "$)\\\\\n";

s += "\\hline\\end{tabular}\n";

saveFile("generated-summary-table.tex", s, "Short summary table");

s = "";

// find N for each journal
var journals = {};

for (var i = 0; i < data.length; i++) {
    var journal = data[i].journal;
    if (Object.keys(journals).includes(journal))
        journals[journal]++;
    else
        journals[journal] = 1;
}

const ordered = Object.keys(journals).sort().reduce(
    (obj, key) => {
        obj[key] = journals[key];
        return obj;
    }, {}
);

var lastOne = Object.keys(ordered).length,
    tabularstuff = "";
s += "\\def\\journalBreakdown{";
for (var i in ordered) {
    s += "\\emph{" + i + "\\/} ($N=" + ordered[i] + "$)" + (lastOne > 2 ? ", " : lastOne > 1 ? " and " : "");
    tabularstuff += "&\\hbox to 3em {\\hfill " + ordered[i] + "}\\hskip 1em \\emph{" + i + "}\\\\";
    lastOne--;
}
s += "}\n";
s += "\\def\\tabularJournalBreakdown{" + tabularstuff + "}\n";
var numberOfJournals = Object.keys(journals).length;

var numberOfAuthors = 0;
for (var i = 0; i < data.length; i++) {
    var thisN = data[i].authors.split(",").length;
    //console.log(thisN + " " + data[i].authors + ".\n");
    numberOfAuthors += thisN;
}

s += "\\global\\newcount \\dataN \\global\\dataN=" + N + "\n";
s += "\\global\\newcount \\countAuthors \\global\\countAuthors=" + numberOfAuthors + "\n";
s += "\\global\\newcount \\countHasBreach \\global\\countHasBreach=" + t.hasBreach + "\n";
s += "\\global\\newcount \\countHasPolicy \\global\\countHasPolicy=" + t.hasCodePolicy + "\n";
s += "\\global\\newcount \\countUsesVersionControlRepository \\global\\countUsesVersionControlRepository=" + t.hasCodeRepo + "\n";
s += "\\global\\newcount \\counthasDataRepository \\global\\counthasDataRepository=" + t.hasDataRepo + "\n";
s += "\\global\\newcount \\countNoCodeInRepo \\global\\countNoCodeInRepo=" + t.hasEmptyRepo + "\n";
s += "\\global\\newcount \\numberOfJournals \\global\\numberOfJournals=" + numberOfJournals + "\n";
s += "\\global\\newcount \\countCodetested \\global\\countCodetested=" + t.hasCodeTested + "\n";
s += "\\global\\newcount \\hasDevelopedRigorously \\global\\hasDevelopedRigorously=" + t.hasDevelopedRigorously + "\n";

saveFile("generated-constants.tex", s, "Generated common definitions and constants");

// generate legend
s = "\\begin{tabular}{lp{4.5in}}\n";
for (var i = 0; i < flagOrder.length; i++) {
    var flag = flagOrder[i];
    s += "\\flagStyle{" + descriptionsOfFields[flag].flag + "}&" + descriptionsOfFields[flag].documentation + "\\\\\n";
}
s += "\\end{tabular}\n";
saveFile("generated-legend.tex", s, "Legend for the main assessment table");

function plural(n, word) {
    return n + " " + word + (n == 1 ? "" : "s");
}

if (true) // make an HTML file of DOIs to help manual checking...
{
    s = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Check data</title></head><body><hr>\n<ol>\n";
    var countHasErrors = 0,
        countHasNoErrors = 0;
    for (var i = 0; i < data.length; i++) {
        if (isFalse(data[i].error)) countHasNoErrors++;
        else countHasErrors++;
    }
    var prefix = "<h1>" + plural(countHasErrors, "paper") + " with errors and/or not double checked</h1><ol>";
    for (var dd = 0; dd < 2; dd++) {
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (isTrue(d.error) == isFalse(dd)) {
                s += prefix + "<li><p>DOI <a href='http://doi.org/" + d.doi + "'>" + d.doi + "<br/>" + (isTrue(d.doubleChecked) ? ("Double checked " + d.doubleChecked) : "<b>* * * Not double checked * * *</b>") + "<br/>\n" +
                    (isTrue(d.error) ? "<blockquote>" + d.error + "<blockquote/>" : "") +
                    d.title + "<br/>" + d.authors + "<br/>" + d.journal + "</a></p></li>\n";
                prefix = "";
            }
        }
        s += "</ol><hr/>";
        prefix = "<h1>" + plural(countHasNoErrors, "paper") + " with no reported errors</h1><ol>"; // break between not checked and already checked
    }
    s += "</html>\n";
    saveFile("generated-data-check.html", s, "Convenient list of data sources with DOIs in HTML");
}

// generate a quick way of opening papers
s = "";
for (var i = 0; i < data.length; i++)
    s += "open \"http://www.doi.org/" + data[i].doi + "\"\n";
saveFile("generated-open-doi.sh", s, "Shell script to open all DOIs");

// since so much noise is generated summmarise error warnings...
console.log("\n" + (!errorCount ? "** No noticed errors to report" : ("** " + plural(errorCount, "error") + " reported")));

console.log("\n" + (!warnCount ? "** No noticed warnings to report" : ("** " + plural(warnCount, "warning") + " reported")));