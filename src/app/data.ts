// Gerado automaticamente a partir de matriz_referencia_enem.csv
import { Area, Status, Subtopic } from "./types";

const TODAY = new Date();
const dStr = (offset: number) => new Date(TODAY.getTime() + offset * 86400000).toISOString().split("T")[0];

const sub = (id: string, name: string, status: Status = "not_started", mastery: number = 1, lastDaysAgo?: number, nextDaysFrom?: number): Subtopic => ({
  id, name, status, mastery,
  lastReview: lastDaysAgo != null ? dStr(-lastDaysAgo) : null,
  nextReview: nextDaysFrom != null ? dStr(nextDaysFrom) : null,
});

export const INITIAL_AREAS: Area[] = [
  {
    "id": "lin",
    "name": "Linguagens",
    "short": "LIN",
    "color": "#4ade80",
    "topics": [
      {
        "id": "lin-t1",
        "name": "Estudo do texto: sequências discursivas e gêneros textuais no sistema de comunicação e informação",
        "subtopics": [
          {
            "id": "lin-s1",
            "name": "Modos de organização da composição textual"
          },
          {
            "id": "lin-s2",
            "name": "Atividades de produção escrita e de leitura de textos gerados nas diferentes esferas sociais  públicas e privadas"
          }
        ]
      },
      {
        "id": "lin-t2",
        "name": "Estudo das práticas corporais: a linguagem corporal como integradora social e formadora de identidade",
        "subtopics": [
          {
            "id": "lin-s3",
            "name": "Performance corporal e identidades juvenis"
          },
          {
            "id": "lin-s4",
            "name": "Possibilidades de vivência crítica e emancipada do lazer"
          },
          {
            "id": "lin-s5",
            "name": "Mitos e verdades sobre os corpos masculino e feminino na sociedade atual"
          },
          {
            "id": "lin-s6",
            "name": "Exercício físico e saúde"
          },
          {
            "id": "lin-s7",
            "name": "Corpo e expressão artística e cultural"
          },
          {
            "id": "lin-s8",
            "name": "O corpo no mundo dos símbolos e como produção da cultura"
          },
          {
            "id": "lin-s9",
            "name": "Práticas corporais e autonomia"
          },
          {
            "id": "lin-s10",
            "name": "Condicionamentos e esforços físicos"
          },
          {
            "id": "lin-s11",
            "name": "O esporte"
          },
          {
            "id": "lin-s12",
            "name": "A dança"
          },
          {
            "id": "lin-s13",
            "name": "As lutas"
          },
          {
            "id": "lin-s14",
            "name": "Os jogos"
          },
          {
            "id": "lin-s15",
            "name": "As brincadeiras"
          }
        ]
      },
      {
        "id": "lin-t3",
        "name": "Produção e recepção de textos artísticos: interpretação e representação do mundo para o fortalecimento dos processos de identidade e cidadania",
        "subtopics": [
          {
            "id": "lin-s16",
            "name": "Artes Visuais: estrutura morfológica, sintática, o contexto da obra artística, o contexto da comunidade"
          },
          {
            "id": "lin-s17",
            "name": "Teatro: estrutura morfológica, sintática, o contexto da obra artística, o contexto da comunidade, as fontes de criação"
          },
          {
            "id": "lin-s18",
            "name": "Música: estrutura morfológica, sintática, o contexto da obra artística, o contexto da comunidade, as fontes de criação"
          },
          {
            "id": "lin-s19",
            "name": "Dança: estrutura morfológica, sintática, o contexto da obra artística, o contexto da comunidade, as fontes de criação"
          },
          {
            "id": "lin-s20",
            "name": "Conteúdos estruturantes das linguagens artísticas (Artes Visuais, Dança, Música, Teatro), elaborados a partir de suas estruturas morfológicas e sintáticas"
          },
          {
            "id": "lin-s21",
            "name": "Inclusão, diversidade e multiculturalidade: a valorização da pluralidade expressada nas produções estéticas e artísticas das minorias sociais e das pessoas com deficiência"
          }
        ]
      },
      {
        "id": "lin-t4",
        "name": "Estudo do texto literário: relações entre produção literária e processo social, concepções artísticas, procedimentos de construção e recepção de textos",
        "subtopics": [
          {
            "id": "lin-s22",
            "name": "Produção literária e processo social"
          },
          {
            "id": "lin-s23",
            "name": "Processos de formação literária e de formação nacional"
          },
          {
            "id": "lin-s24",
            "name": "Produção de textos literários, sua recepção e a constituição do patrimônio literário nacional"
          },
          {
            "id": "lin-s25",
            "name": "Relações entre a dialética cosmopolitismo/localismo e a produção literária nacional"
          },
          {
            "id": "lin-s26",
            "name": "Elementos de continuidade e ruptura entre os diversos momentos da literatura brasileira"
          },
          {
            "id": "lin-s27",
            "name": "Associações entre concepções artísticas e procedimentos de construção do texto literário em seus gêneros (épico/narrativo, lírico e dramático) e formas diversas"
          },
          {
            "id": "lin-s28",
            "name": "Articulações entre os recursos expressivos e estruturais do texto literário e o processo social relacionado ao momento de sua produção"
          },
          {
            "id": "lin-s29",
            "name": "Representação literária: natureza, função, organização e estrutura do texto literário"
          },
          {
            "id": "lin-s30",
            "name": "Relações entre literatura, outras artes e outros saberes"
          }
        ]
      },
      {
        "id": "lin-t5",
        "name": "Estudo dos aspectos linguísticos em diferentes textos: recursos expressivos da língua, procedimentos de construção e recepção de textos",
        "subtopics": [
          {
            "id": "lin-s31",
            "name": "Organização da macroestrutura semântica e a articulação entre ideias e proposições (relações lógico-semânticas)"
          }
        ]
      },
      {
        "id": "lin-t6",
        "name": "Estudo do texto argumentativo, seus gêneros e recursos linguísticos: argumentação  tipo, gêneros e usos em língua portuguesa",
        "subtopics": [
          {
            "id": "lin-s32",
            "name": "Formas de apresentação de diferentes pontos de vista"
          },
          {
            "id": "lin-s33",
            "name": "Organização e progressão textual"
          },
          {
            "id": "lin-s34",
            "name": "Papéis sociais e comunicativos dos interlocutores, relação entre usos e propósitos comunicativos, função sociocomunicativa do gênero, aspectos da dimensão espaçotemporal em que se produz o texto"
          }
        ]
      },
      {
        "id": "lin-t7",
        "name": "Estudo dos aspectos linguísticos da língua portuguesa: usos da língua  norma culta e variação linguística",
        "subtopics": [
          {
            "id": "lin-s35",
            "name": "Uso dos recursos linguísticos em relação ao contexto em que o texto é constituído: elementos de referência pessoal, temporal, espacial, registro linguístico, grau de formalidade, seleção lexical, tempos e modos verbais"
          },
          {
            "id": "lin-s36",
            "name": "Uso dos recursos linguísticos em processo de coesão textual: elementos de articulação das sequências dos textos ou à construção da microestrutura do texto"
          }
        ]
      },
      {
        "id": "lin-t8",
        "name": "Estudo dos gêneros digitais: tecnologia da comunicação e informação  impacto e função social",
        "subtopics": [
          {
            "id": "lin-s37",
            "name": "Texto literário típico da cultura de massa: o suporte textual em gêneros digitais"
          },
          {
            "id": "lin-s38",
            "name": "Caracterização dos interlocutores na comunicação tecnológica"
          },
          {
            "id": "lin-s39",
            "name": "Recursos linguísticos e os gêneros digitais"
          },
          {
            "id": "lin-s40",
            "name": "Função social das novas tecnologias"
          }
        ]
      }
    ]
  },
  {
    "id": "mat",
    "name": "Matemática",
    "short": "MAT",
    "color": "#60a5fa",
    "topics": [
      {
        "id": "mat-t9",
        "name": "Conhecimentos numéricos",
        "subtopics": [
          {
            "id": "mat-s41",
            "name": "Operações em conjuntos numéricos (naturais, inteiros, racionais e reais)"
          },
          {
            "id": "mat-s42",
            "name": "Desigualdades, divisibilidade, fatoração, razões e proporções, porcentagem e juros"
          },
          {
            "id": "mat-s43",
            "name": "Relações de dependência entre grandezas, sequências e progressões, princípios de contagem"
          }
        ]
      },
      {
        "id": "mat-t10",
        "name": "Conhecimentos geométricos",
        "subtopics": [
          {
            "id": "mat-s44",
            "name": "Características das figuras geométricas planas e espaciais"
          },
          {
            "id": "mat-s45",
            "name": "Grandezas, unidades de medida e escalas"
          },
          {
            "id": "mat-s46",
            "name": "Comprimentos, áreas e volumes"
          },
          {
            "id": "mat-s47",
            "name": "Ângulos"
          },
          {
            "id": "mat-s48",
            "name": "Posições de retas"
          },
          {
            "id": "mat-s49",
            "name": "Simetrias de figuras planas ou espaciais"
          },
          {
            "id": "mat-s50",
            "name": "Congruência e semelhança de triângulos"
          },
          {
            "id": "mat-s51",
            "name": "Teorema de Tales"
          },
          {
            "id": "mat-s52",
            "name": "Relações métricas nos triângulos"
          },
          {
            "id": "mat-s53",
            "name": "Circunferências"
          },
          {
            "id": "mat-s54",
            "name": "Trigonometria do ângulo agudo"
          }
        ]
      },
      {
        "id": "mat-t11",
        "name": "Conhecimentos de estatística e probabilidade",
        "subtopics": [
          {
            "id": "mat-s55",
            "name": "Representação e análise de dados"
          },
          {
            "id": "mat-s56",
            "name": "Medidas de tendência central (médias, moda e mediana)"
          },
          {
            "id": "mat-s57",
            "name": "Desvios e variância"
          },
          {
            "id": "mat-s58",
            "name": "Noções de probabilidade"
          }
        ]
      },
      {
        "id": "mat-t12",
        "name": "Conhecimentos algébricos",
        "subtopics": [
          {
            "id": "mat-s59",
            "name": "Gráficos e funções"
          },
          {
            "id": "mat-s60",
            "name": "Funções algébricas do 1º e do 2º graus, polinomiais, racionais, exponenciais e logarítmicas"
          },
          {
            "id": "mat-s61",
            "name": "Equações e inequações"
          },
          {
            "id": "mat-s62",
            "name": "Relações no ciclo trigonométrico e funções trigonométricas"
          }
        ]
      },
      {
        "id": "mat-t13",
        "name": "Conhecimentos algébricos/geométricos",
        "subtopics": [
          {
            "id": "mat-s63",
            "name": "Plano cartesiano"
          },
          {
            "id": "mat-s64",
            "name": "Retas"
          },
          {
            "id": "mat-s65",
            "name": "Circunferências"
          },
          {
            "id": "mat-s66",
            "name": "Paralelismo e perpendicularidade, sistemas de equações"
          }
        ]
      }
    ]
  },
  {
    "id": "nat",
    "name": "Ciências da Natureza",
    "short": "NAT",
    "color": "#22d3ee",
    "topics": [
      {
        "id": "nat-t14",
        "name": "Conhecimentos básicos e fundamentais",
        "subtopics": [
          {
            "id": "nat-s67",
            "name": "Noções de ordem de grandeza"
          },
          {
            "id": "nat-s68",
            "name": "Notação Científica"
          },
          {
            "id": "nat-s69",
            "name": "Sistema Internacional de Unidades"
          },
          {
            "id": "nat-s70",
            "name": "Metodologia de investigação: a procura de regularidades e de sinais na interpretação física do mundo"
          },
          {
            "id": "nat-s71",
            "name": "Observações e mensurações: representação de grandezas físicas como grandezas mensuráveis"
          },
          {
            "id": "nat-s72",
            "name": "Ferramentas básicas: gráficos e vetores"
          },
          {
            "id": "nat-s73",
            "name": "Conceituação de grandezas vetoriais e escalares"
          },
          {
            "id": "nat-s74",
            "name": "Operações básicas com vetores"
          }
        ]
      },
      {
        "id": "nat-t15",
        "name": "O movimento, o equilíbrio e a descoberta de leis físicas",
        "subtopics": [
          {
            "id": "nat-s75",
            "name": "Grandezas fundamentais da mecânica: tempo, espaço, velocidade e aceleração"
          },
          {
            "id": "nat-s76",
            "name": "Relação histórica entre força e movimento"
          },
          {
            "id": "nat-s77",
            "name": "Descrições do movimento e sua interpretação: quantificação do movimento e sua descrição matemática e gráfica"
          },
          {
            "id": "nat-s78",
            "name": "Casos especiais de movimentos e suas regularidades observáveis"
          },
          {
            "id": "nat-s79",
            "name": "Conceito de inércia"
          },
          {
            "id": "nat-s80",
            "name": "Noção de sistemas de referência inerciais e não inerciais"
          },
          {
            "id": "nat-s81",
            "name": "Noção dinâmica de massa e quantidade de movimento (momento linear)"
          },
          {
            "id": "nat-s82",
            "name": "Força e variação da quantidade de movimento"
          },
          {
            "id": "nat-s83",
            "name": "Leis de Newton"
          },
          {
            "id": "nat-s84",
            "name": "Centro de massa e a ideia de ponto material"
          },
          {
            "id": "nat-s85",
            "name": "Conceito de forças externas e internas"
          },
          {
            "id": "nat-s86",
            "name": "Lei da conservação da quantidade de movimento (momento linear) e teorema do impulso"
          },
          {
            "id": "nat-s87",
            "name": "Momento de uma força (torque)"
          },
          {
            "id": "nat-s88",
            "name": "Condições de equilíbrio estático de ponto material e de corpos rígidos"
          },
          {
            "id": "nat-s89",
            "name": "Força de atrito, força peso, força normal de contato e tração"
          },
          {
            "id": "nat-s90",
            "name": "Diagramas de forças"
          },
          {
            "id": "nat-s91",
            "name": "Identificação das forças que atuam nos movimentos circulares"
          },
          {
            "id": "nat-s92",
            "name": "Noção de força centrípeta e sua quantificação"
          },
          {
            "id": "nat-s93",
            "name": "A hidrostática: aspectos históricos e variáveis relevantes"
          },
          {
            "id": "nat-s94",
            "name": "Empuxo"
          },
          {
            "id": "nat-s95",
            "name": "Princípios de Pascal, Arquimedes e Stevin: condições de flutuação, relação entre diferença de nível e pressão hidrostática"
          }
        ]
      },
      {
        "id": "nat-t16",
        "name": "Energia, trabalho e potência",
        "subtopics": [
          {
            "id": "nat-s96",
            "name": "Conceituação de trabalho, energia e potência"
          },
          {
            "id": "nat-s97",
            "name": "Conceito de energia potencial e de energia cinética"
          },
          {
            "id": "nat-s98",
            "name": "Conservação de energia mecânica e dissipação de energia"
          },
          {
            "id": "nat-s99",
            "name": "Trabalho da força gravitacional e energia potencial gravitacional"
          },
          {
            "id": "nat-s100",
            "name": "Forças conservativas e dissipativas"
          }
        ]
      },
      {
        "id": "nat-t17",
        "name": "A Mecânica e o funcionamento do Universo",
        "subtopics": [
          {
            "id": "nat-s101",
            "name": "Força peso"
          },
          {
            "id": "nat-s102",
            "name": "Aceleração gravitacional"
          },
          {
            "id": "nat-s103",
            "name": "Lei da Gravitação Universal"
          },
          {
            "id": "nat-s104",
            "name": "Leis de Kepler"
          },
          {
            "id": "nat-s105",
            "name": "Movimentos de corpos celestes"
          },
          {
            "id": "nat-s106",
            "name": "Influência na Terra: marés e variações climáticas"
          },
          {
            "id": "nat-s107",
            "name": "Concepções históricas sobre a origem do universo e sua evolução"
          }
        ]
      },
      {
        "id": "nat-t18",
        "name": "Fenômenos Elétricos e Magnéticos",
        "subtopics": [
          {
            "id": "nat-s108",
            "name": "Carga elétrica e corrente elétrica"
          },
          {
            "id": "nat-s109",
            "name": "Lei de Coulomb"
          },
          {
            "id": "nat-s110",
            "name": "Campo elétrico e potencial elétrico"
          },
          {
            "id": "nat-s111",
            "name": "Linhas de campo"
          },
          {
            "id": "nat-s112",
            "name": "Superfícies equipotenciais"
          },
          {
            "id": "nat-s113",
            "name": "Poder das pontas"
          },
          {
            "id": "nat-s114",
            "name": "Blindagem"
          },
          {
            "id": "nat-s115",
            "name": "Capacitores"
          },
          {
            "id": "nat-s116",
            "name": "Efeito Joule"
          },
          {
            "id": "nat-s117",
            "name": "Lei de Ohm"
          },
          {
            "id": "nat-s118",
            "name": "Resistência elétrica e resistividade"
          },
          {
            "id": "nat-s119",
            "name": "Relações entre grandezas elétricas: tensão, corrente, potência e energia"
          },
          {
            "id": "nat-s120",
            "name": "Circuitos elétricos simples"
          },
          {
            "id": "nat-s121",
            "name": "Correntes contínua e alternada"
          },
          {
            "id": "nat-s122",
            "name": "Medidores elétricos"
          },
          {
            "id": "nat-s123",
            "name": "Representação gráfica de circuitos"
          },
          {
            "id": "nat-s124",
            "name": "Símbolos convencionais"
          },
          {
            "id": "nat-s125",
            "name": "Potência e consumo de energia em dispositivos elétricos"
          },
          {
            "id": "nat-s126",
            "name": "Campo magnético"
          },
          {
            "id": "nat-s127",
            "name": "Imãs permanentes"
          },
          {
            "id": "nat-s128",
            "name": "Linhas de campo magnético"
          },
          {
            "id": "nat-s129",
            "name": "Campo magnético terrestre"
          }
        ]
      },
      {
        "id": "nat-t19",
        "name": "Oscilações, ondas, óptica e radiação",
        "subtopics": [
          {
            "id": "nat-s130",
            "name": "Feixes e frentes de ondas"
          },
          {
            "id": "nat-s131",
            "name": "Reflexão e refração"
          },
          {
            "id": "nat-s132",
            "name": "Óptica geométrica: lentes e espelhos"
          },
          {
            "id": "nat-s133",
            "name": "Formação de imagens"
          },
          {
            "id": "nat-s134",
            "name": "Instrumentos ópticos simples"
          },
          {
            "id": "nat-s135",
            "name": "Fenômenos ondulatórios"
          },
          {
            "id": "nat-s136",
            "name": "Pulsos e ondas"
          },
          {
            "id": "nat-s137",
            "name": "Período, frequência, ciclo"
          },
          {
            "id": "nat-s138",
            "name": "Propagação: relação entre velocidade, frequência e comprimento de onda"
          },
          {
            "id": "nat-s139",
            "name": "Ondas em diferentes meios de propagação"
          }
        ]
      },
      {
        "id": "nat-t20",
        "name": "O calor e os fenômenos térmicos",
        "subtopics": [
          {
            "id": "nat-s140",
            "name": "Conceitos de calor e de temperatura"
          },
          {
            "id": "nat-s141",
            "name": "Escalas termométricas"
          },
          {
            "id": "nat-s142",
            "name": "Transferência de calor e equilíbrio térmico"
          },
          {
            "id": "nat-s143",
            "name": "Capacidade calorífica e calor específico"
          },
          {
            "id": "nat-s144",
            "name": "Condução do calor"
          },
          {
            "id": "nat-s145",
            "name": "Dilatação térmica"
          },
          {
            "id": "nat-s146",
            "name": "Mudanças de estado físico e calor latente de transformação"
          },
          {
            "id": "nat-s147",
            "name": "Comportamento de gases ideais"
          },
          {
            "id": "nat-s148",
            "name": "Máquinas térmicas"
          },
          {
            "id": "nat-s149",
            "name": "Ciclo de Carnot"
          },
          {
            "id": "nat-s150",
            "name": "Leis da Termodinâmica"
          },
          {
            "id": "nat-s151",
            "name": "Aplicações e fenômenos térmicos de uso cotidiano"
          },
          {
            "id": "nat-s152",
            "name": "Compreensão de fenômenos climáticos relacionados ao ciclo da água"
          }
        ]
      },
      {
        "id": "nat-t21",
        "name": "Transformações químicas",
        "subtopics": [
          {
            "id": "nat-s153",
            "name": "Evidências de transformações químicas"
          },
          {
            "id": "nat-s154",
            "name": "Interpretando transformações químicas"
          },
          {
            "id": "nat-s155",
            "name": "Sistemas Gasosos: Lei dos gases"
          },
          {
            "id": "nat-s156",
            "name": "Equação geral dos gases ideais, Princípio de Avogadro, conceito de molécula"
          },
          {
            "id": "nat-s157",
            "name": "Massa molar, volume molar dos gases"
          },
          {
            "id": "nat-s158",
            "name": "Teoria cinética dos gases"
          },
          {
            "id": "nat-s159",
            "name": "Misturas gasosas"
          },
          {
            "id": "nat-s160",
            "name": "Modelo corpuscular da matéria"
          },
          {
            "id": "nat-s161",
            "name": "Modelo atômico de Dalton"
          },
          {
            "id": "nat-s162",
            "name": "Natureza elétrica da matéria: Modelo Atômico de Thomson, Rutherford, Rutherford-Bohr"
          },
          {
            "id": "nat-s163",
            "name": "Átomos e sua estrutura"
          },
          {
            "id": "nat-s164",
            "name": "Número atômico, número de massa, isótopos, massa atômica"
          },
          {
            "id": "nat-s165",
            "name": "Elementos químicos e Tabela Periódica"
          },
          {
            "id": "nat-s166",
            "name": "Reações químicas"
          }
        ]
      },
      {
        "id": "nat-t22",
        "name": "Representação das transformações químicas",
        "subtopics": [
          {
            "id": "nat-s167",
            "name": "Fórmulas químicas"
          },
          {
            "id": "nat-s168",
            "name": "Balanceamento de equações químicas"
          },
          {
            "id": "nat-s169",
            "name": "Aspectos quantitativos das transformações químicas"
          },
          {
            "id": "nat-s170",
            "name": "Leis ponderais das reações químicas"
          },
          {
            "id": "nat-s171",
            "name": "Determinação de fórmulas químicas"
          },
          {
            "id": "nat-s172",
            "name": "Grandezas Químicas: massa, volume, mol, massa molar, constante de Avogadro"
          },
          {
            "id": "nat-s173",
            "name": "Cálculos estequiométricos"
          }
        ]
      },
      {
        "id": "nat-t23",
        "name": "Materiais, suas propriedades e usos",
        "subtopics": [
          {
            "id": "nat-s174",
            "name": "Propriedades de materiais"
          },
          {
            "id": "nat-s175",
            "name": "Estados físicos de materiais"
          },
          {
            "id": "nat-s176",
            "name": "Mudanças de estado"
          },
          {
            "id": "nat-s177",
            "name": "Misturas: tipos e métodos de separação"
          },
          {
            "id": "nat-s178",
            "name": "Substâncias químicas: classificação e características gerais"
          },
          {
            "id": "nat-s179",
            "name": "Metais e Ligas metálicas"
          },
          {
            "id": "nat-s180",
            "name": "Ferro, cobre e alumínio"
          },
          {
            "id": "nat-s181",
            "name": "Ligações metálicas"
          },
          {
            "id": "nat-s182",
            "name": "Substâncias iônicas: características e propriedades"
          },
          {
            "id": "nat-s183",
            "name": "Substâncias iônicas do grupo: cloreto, carbonato, nitrato e sulfato"
          },
          {
            "id": "nat-s184",
            "name": "Ligação iônica"
          },
          {
            "id": "nat-s185",
            "name": "Substâncias moleculares: características e propriedades"
          },
          {
            "id": "nat-s186",
            "name": "Substâncias moleculares: H?, O?, N?, Cl?, NH?, H?O, HCl, CH?"
          },
          {
            "id": "nat-s187",
            "name": "Ligação Covalente"
          },
          {
            "id": "nat-s188",
            "name": "Polaridade de moléculas"
          },
          {
            "id": "nat-s189",
            "name": "Forças intermoleculares"
          },
          {
            "id": "nat-s190",
            "name": "Relação entre estruturas, propriedade e aplicação das substâncias"
          }
        ]
      },
      {
        "id": "nat-t24",
        "name": "Água",
        "subtopics": [
          {
            "id": "nat-s191",
            "name": "Ocorrência e importância na vida animal e vegetal"
          },
          {
            "id": "nat-s192",
            "name": "Ligação, estrutura e propriedades"
          },
          {
            "id": "nat-s193",
            "name": "Sistemas em Solução Aquosa: soluções verdadeiras, soluções coloidais e suspensões"
          },
          {
            "id": "nat-s194",
            "name": "Solubilidade"
          },
          {
            "id": "nat-s195",
            "name": "Concentração das soluções"
          },
          {
            "id": "nat-s196",
            "name": "Aspectos qualitativos das propriedades coligativas das soluções"
          },
          {
            "id": "nat-s197",
            "name": "Ácidos, bases, sais e óxidos: definição, classificação, propriedades, formulação e nomenclatura"
          },
          {
            "id": "nat-s198",
            "name": "Conceitos de ácidos e base"
          },
          {
            "id": "nat-s199",
            "name": "Principais propriedades dos ácidos e bases: indicadores, condutibilidade elétrica, reação com metais, reação de neutralização"
          }
        ]
      },
      {
        "id": "nat-t25",
        "name": "Transformações químicas e energia",
        "subtopics": [
          {
            "id": "nat-s200",
            "name": "Transformações químicas e energia calorífica"
          },
          {
            "id": "nat-s201",
            "name": "Calor de reação"
          },
          {
            "id": "nat-s202",
            "name": "Entalpia"
          },
          {
            "id": "nat-s203",
            "name": "Equações termoquímicas"
          },
          {
            "id": "nat-s204",
            "name": "Lei de Hess"
          },
          {
            "id": "nat-s205",
            "name": "Transformações químicas e energia elétrica"
          },
          {
            "id": "nat-s206",
            "name": "Reação de oxirredução"
          },
          {
            "id": "nat-s207",
            "name": "Potenciais padrão de redução"
          },
          {
            "id": "nat-s208",
            "name": "Pilha"
          },
          {
            "id": "nat-s209",
            "name": "Eletrólise"
          },
          {
            "id": "nat-s210",
            "name": "Leis de Faraday"
          },
          {
            "id": "nat-s211",
            "name": "Transformações nucleares"
          },
          {
            "id": "nat-s212",
            "name": "Conceitos fundamentais da radioatividade"
          },
          {
            "id": "nat-s213",
            "name": "Reações de fissão e fusão nuclear"
          },
          {
            "id": "nat-s214",
            "name": "Desintegração radioativa e radioisótopos"
          }
        ]
      },
      {
        "id": "nat-t26",
        "name": "Dinâmica das transformações químicas",
        "subtopics": [
          {
            "id": "nat-s215",
            "name": "Transformações químicas e velocidade"
          },
          {
            "id": "nat-s216",
            "name": "Velocidade de reação"
          },
          {
            "id": "nat-s217",
            "name": "Energia de ativação"
          },
          {
            "id": "nat-s218",
            "name": "Fatores que alteram a velocidade de reação: concentração, pressão, temperatura e catalisador"
          }
        ]
      },
      {
        "id": "nat-t27",
        "name": "Transformação Química e Equilíbrio",
        "subtopics": [
          {
            "id": "nat-s219",
            "name": "Caracterização do sistema em equilíbrio"
          },
          {
            "id": "nat-s220",
            "name": "Constante de equilíbrio"
          },
          {
            "id": "nat-s221",
            "name": "Produto iônico da água, equilíbrio ácido-base e pH"
          },
          {
            "id": "nat-s222",
            "name": "Solubilidade dos sais e hidrólise"
          },
          {
            "id": "nat-s223",
            "name": "Fatores que alteram o sistema em equilíbrio"
          },
          {
            "id": "nat-s224",
            "name": "Aplicação da velocidade e do equilíbrio químico no cotidiano"
          }
        ]
      },
      {
        "id": "nat-t28",
        "name": "Compostos de Carbono",
        "subtopics": [
          {
            "id": "nat-s225",
            "name": "Características gerais dos compostos orgânicos"
          },
          {
            "id": "nat-s226",
            "name": "Principais funções orgânicas"
          },
          {
            "id": "nat-s227",
            "name": "Estrutura e propriedades de Hidrocarbonetos"
          },
          {
            "id": "nat-s228",
            "name": "Estrutura e propriedades de compostos orgânicos oxigenados"
          },
          {
            "id": "nat-s229",
            "name": "Fermentação"
          },
          {
            "id": "nat-s230",
            "name": "Estrutura e propriedades de compostos orgânicos nitrogenados"
          },
          {
            "id": "nat-s231",
            "name": "Macromoléculas naturais e sintéticas"
          },
          {
            "id": "nat-s232",
            "name": "Noções básicas sobre polímeros"
          },
          {
            "id": "nat-s233",
            "name": "Amido, glicogênio e celulose"
          },
          {
            "id": "nat-s234",
            "name": "Borracha natural e sintética"
          },
          {
            "id": "nat-s235",
            "name": "Polietileno, poliestireno, PVC, Teflon, náilon"
          },
          {
            "id": "nat-s236",
            "name": "Óleos e gorduras, sabões e detergentes sintéticos"
          },
          {
            "id": "nat-s237",
            "name": "Proteínas e enzimas"
          }
        ]
      },
      {
        "id": "nat-t29",
        "name": "Relações da Química com as tecnologias, a sociedade e o meio ambiente",
        "subtopics": [
          {
            "id": "nat-s238",
            "name": "Química no cotidiano"
          },
          {
            "id": "nat-s239",
            "name": "Química na agricultura e na saúde"
          },
          {
            "id": "nat-s240",
            "name": "Química nos alimentos"
          },
          {
            "id": "nat-s241",
            "name": "Química e ambiente"
          },
          {
            "id": "nat-s242",
            "name": "Aspectos científico-tecnológicos, socioeconômicos e ambientais associados à obtenção ou produção de substâncias químicas"
          },
          {
            "id": "nat-s243",
            "name": "Indústria química: obtenção e utilização do cloro, hidróxido de sódio, ácido sulfúrico, amônia e ácido nítrico"
          },
          {
            "id": "nat-s244",
            "name": "Mineração e metalurgia"
          },
          {
            "id": "nat-s245",
            "name": "Poluição e tratamento de água"
          },
          {
            "id": "nat-s246",
            "name": "Poluição atmosférica"
          },
          {
            "id": "nat-s247",
            "name": "Contaminação e proteção do ambiente"
          }
        ]
      },
      {
        "id": "nat-t30",
        "name": "Energias químicas no cotidiano",
        "subtopics": [
          {
            "id": "nat-s248",
            "name": "Petróleo, gás natural e carvão"
          },
          {
            "id": "nat-s249",
            "name": "Madeira e hulha"
          },
          {
            "id": "nat-s250",
            "name": "Biomassa"
          },
          {
            "id": "nat-s251",
            "name": "Biocombustíveis"
          },
          {
            "id": "nat-s252",
            "name": "Impactos ambientais de combustíveis fósseis"
          },
          {
            "id": "nat-s253",
            "name": "Energia nuclear"
          },
          {
            "id": "nat-s254",
            "name": "Lixo atômico"
          },
          {
            "id": "nat-s255",
            "name": "Vantagens e desvantagens do uso de energia nuclear"
          }
        ]
      },
      {
        "id": "nat-t31",
        "name": "Moléculas, células e tecidos",
        "subtopics": [
          {
            "id": "nat-s256",
            "name": "Estrutura e fisiologia celular: membrana, citoplasma e núcleo"
          },
          {
            "id": "nat-s257",
            "name": "Divisão celular"
          },
          {
            "id": "nat-s258",
            "name": "Aspectos bioquímicos das estruturas celulares"
          },
          {
            "id": "nat-s259",
            "name": "Aspectos gerais do metabolismo celular"
          },
          {
            "id": "nat-s260",
            "name": "Metabolismo energético: fotossíntese e respiração"
          },
          {
            "id": "nat-s261",
            "name": "Codificação da informação genética"
          },
          {
            "id": "nat-s262",
            "name": "Síntese proteica"
          },
          {
            "id": "nat-s263",
            "name": "Diferenciação celular"
          },
          {
            "id": "nat-s264",
            "name": "Principais tecidos animais e vegetais"
          },
          {
            "id": "nat-s265",
            "name": "Origem e evolução das células"
          },
          {
            "id": "nat-s266",
            "name": "Noções sobre células-tronco, clonagem e tecnologia do DNA recombinante"
          },
          {
            "id": "nat-s267",
            "name": "Aplicações de biotecnologia na produção de alimentos, fármacos e componentes biológicos"
          },
          {
            "id": "nat-s268",
            "name": "Aplicações de tecnologias relacionadas ao DNA a investigações científicas, determinação da paternidade, investigação criminal e identificação de indivíduos"
          },
          {
            "id": "nat-s269",
            "name": "Aspectos éticos relacionados ao desenvolvimento biotecnológico"
          },
          {
            "id": "nat-s270",
            "name": "Biotecnologia e sustentabilidade"
          }
        ]
      },
      {
        "id": "nat-t32",
        "name": "Hereditariedade e diversidade da vida",
        "subtopics": [
          {
            "id": "nat-s271",
            "name": "Princípios básicos que regem a transmissão de características hereditárias"
          },
          {
            "id": "nat-s272",
            "name": "Concepções pré-mendelianas sobre a hereditariedade"
          },
          {
            "id": "nat-s273",
            "name": "Aspectos genéticos do funcionamento do corpo humano"
          },
          {
            "id": "nat-s274",
            "name": "Antígenos e anticorpos"
          },
          {
            "id": "nat-s275",
            "name": "Grupos sanguíneos, transplantes e doenças autoimunes"
          },
          {
            "id": "nat-s276",
            "name": "Neoplasias e a influência de fatores ambientais"
          },
          {
            "id": "nat-s277",
            "name": "Mutações gênicas e cromossômicas"
          },
          {
            "id": "nat-s278",
            "name": "Aconselhamento genético"
          },
          {
            "id": "nat-s279",
            "name": "Fundamentos genéticos da evolução"
          },
          {
            "id": "nat-s280",
            "name": "Aspectos genéticos da formação e manutenção da diversidade biológica"
          }
        ]
      },
      {
        "id": "nat-t33",
        "name": "Identidade dos seres vivos",
        "subtopics": [
          {
            "id": "nat-s281",
            "name": "Níveis de organização dos seres vivos"
          },
          {
            "id": "nat-s282",
            "name": "Vírus, procariontes e eucariontes"
          },
          {
            "id": "nat-s283",
            "name": "Autótrofos e heterótrofos"
          },
          {
            "id": "nat-s284",
            "name": "Seres unicelulares e pluricelulares"
          },
          {
            "id": "nat-s285",
            "name": "Sistemática e as grandes linhas da evolução dos seres vivos"
          },
          {
            "id": "nat-s286",
            "name": "Tipos de ciclo de vida"
          },
          {
            "id": "nat-s287",
            "name": "Evolução e padrões anatômicos e fisiológicos observados nos seres vivos"
          },
          {
            "id": "nat-s288",
            "name": "Funções vitais dos seres vivos e sua relação com a adaptação desses organismos a diferentes ambientes"
          },
          {
            "id": "nat-s289",
            "name": "Embriologia, anatomia e fisiologia humana"
          },
          {
            "id": "nat-s290",
            "name": "Evolução humana"
          },
          {
            "id": "nat-s291",
            "name": "Biotecnologia e sistemática"
          }
        ]
      },
      {
        "id": "nat-t34",
        "name": "Ecologia e ciências ambientais",
        "subtopics": [
          {
            "id": "nat-s292",
            "name": "Ecossistemas"
          },
          {
            "id": "nat-s293",
            "name": "Fatores bióticos e abióticos"
          },
          {
            "id": "nat-s294",
            "name": "Habitat e nicho ecológico"
          },
          {
            "id": "nat-s295",
            "name": "Comunidade biológica: teia alimentar, sucessão e comunidade clímax"
          },
          {
            "id": "nat-s296",
            "name": "Dinâmica de populações"
          },
          {
            "id": "nat-s297",
            "name": "Interações entre os seres vivos"
          },
          {
            "id": "nat-s298",
            "name": "Ciclos biogeoquímicos"
          },
          {
            "id": "nat-s299",
            "name": "Fluxo de energia no ecossistema"
          },
          {
            "id": "nat-s300",
            "name": "Biogeografia"
          },
          {
            "id": "nat-s301",
            "name": "Biomas brasileiros"
          },
          {
            "id": "nat-s302",
            "name": "Exploração e uso de recursos naturais"
          },
          {
            "id": "nat-s303",
            "name": "Problemas ambientais: mudanças climáticas, efeito estufa, desmatamento, erosão, poluição da água, do solo e do ar"
          },
          {
            "id": "nat-s304",
            "name": "Conservação e recuperação de ecossistemas"
          },
          {
            "id": "nat-s305",
            "name": "Conservação da biodiversidade"
          },
          {
            "id": "nat-s306",
            "name": "Tecnologias ambientais"
          },
          {
            "id": "nat-s307",
            "name": "Noções de saneamento básico"
          },
          {
            "id": "nat-s308",
            "name": "Noções de legislação ambiental: água, florestas, unidades de conservação, biodiversidade"
          }
        ]
      },
      {
        "id": "nat-t35",
        "name": "Origem e evolução da vida",
        "subtopics": [
          {
            "id": "nat-s309",
            "name": "Biologia como ciência: história, métodos, técnicas e experimentação"
          },
          {
            "id": "nat-s310",
            "name": "Hipóteses sobre a origem do Universo, da Terra e dos seres vivos"
          },
          {
            "id": "nat-s311",
            "name": "Teorias de evolução"
          },
          {
            "id": "nat-s312",
            "name": "Explicações pré-darwinistas para a modificação das espécies"
          },
          {
            "id": "nat-s313",
            "name": "Teoria evolutiva de Charles Darwin"
          },
          {
            "id": "nat-s314",
            "name": "Teoria sintética da evolução"
          },
          {
            "id": "nat-s315",
            "name": "Seleção artificial e seu impacto sobre ambientes naturais e sobre populações humanas"
          }
        ]
      },
      {
        "id": "nat-t36",
        "name": "Qualidade de vida das populações humanas",
        "subtopics": [
          {
            "id": "nat-s316",
            "name": "Aspectos biológicos da pobreza e do desenvolvimento humano"
          },
          {
            "id": "nat-s317",
            "name": "Indicadores sociais, ambientais e econômicos. Índice de desenvolvimento humano"
          },
          {
            "id": "nat-s318",
            "name": "Principais doenças que afetam a população brasileira: caracterização, prevenção e profilaxia"
          },
          {
            "id": "nat-s319",
            "name": "Noções de primeiros socorros"
          },
          {
            "id": "nat-s320",
            "name": "Infecções Sexualmente Transmissíveis"
          },
          {
            "id": "nat-s321",
            "name": "Aspectos sociais da biologia: uso indevido de drogas, gravidez na adolescência, obesidade"
          },
          {
            "id": "nat-s322",
            "name": "Violência e segurança pública"
          },
          {
            "id": "nat-s323",
            "name": "Exercícios físicos e vida saudável"
          },
          {
            "id": "nat-s324",
            "name": "Aspectos biológicos do desenvolvimento sustentável"
          },
          {
            "id": "nat-s325",
            "name": "Legislação e cidadania"
          }
        ]
      }
    ]
  },
  {
    "id": "hum",
    "name": "Ciências Humanas",
    "short": "HUM",
    "color": "#a78bfa",
    "topics": [
      {
        "id": "hum-t37",
        "name": "Diversidade cultural, conflitos e vida em sociedade",
        "subtopics": [
          {
            "id": "hum-s326",
            "name": "Cultura material e imaterial: patrimônio e diversidade cultural no Brasil"
          },
          {
            "id": "hum-s327",
            "name": "A Conquista da América: conflitos entre europeus e indígenas na América colonial"
          },
          {
            "id": "hum-s328",
            "name": "A escravidão e as formas de resistência indígena e africana na América"
          },
          {
            "id": "hum-s329",
            "name": "História cultural dos povos africanos: a luta dos negros no Brasil e o negro na formação da sociedade brasileira"
          },
          {
            "id": "hum-s330",
            "name": "História dos povos indígenas e a formação sócio-cultural brasileira"
          },
          {
            "id": "hum-s331",
            "name": "Movimentos culturais no mundo ocidental e seus impactos na vida política e social"
          }
        ]
      },
      {
        "id": "hum-t38",
        "name": "Formas de organização social, movimentos sociais, pensamento político e ação do Estado",
        "subtopics": [
          {
            "id": "hum-s332",
            "name": "Cidadania e democracia na Antiguidade"
          },
          {
            "id": "hum-s333",
            "name": "Estado e direitos do cidadão a partir da Idade Moderna"
          },
          {
            "id": "hum-s334",
            "name": "Democracia direta, indireta e representativa"
          },
          {
            "id": "hum-s335",
            "name": "Revoluções sociais e políticas na Europa Moderna"
          },
          {
            "id": "hum-s336",
            "name": "Formação territorial brasileira"
          },
          {
            "id": "hum-s337",
            "name": "Regiões brasileiras"
          },
          {
            "id": "hum-s338",
            "name": "Políticas de reordenamento territorial"
          },
          {
            "id": "hum-s339",
            "name": "Lutas pela conquista da independência política das colônias da América"
          },
          {
            "id": "hum-s340",
            "name": "Grupos sociais em conflito no Brasil imperial e a construção da nação"
          },
          {
            "id": "hum-s341",
            "name": "Desenvolvimento do pensamento liberal na sociedade capitalista e seus críticos nos séculos XIX e XX"
          },
          {
            "id": "hum-s342",
            "name": "Políticas de colonização, migração, imigração e emigração no Brasil nos séculos XIX e XX"
          },
          {
            "id": "hum-s343",
            "name": "Atuação dos grupos sociais e os grandes processos revolucionários do século XX: Revolução Bolchevique, Revolução Chinesa, Revolução Cubana"
          },
          {
            "id": "hum-s344",
            "name": "Geopolítica e conflitos entre os séculos XIX e XX: Imperialismo, a ocupação da Ásia e da África, as Guerras Mundiais e a Guerra Fria"
          },
          {
            "id": "hum-s345",
            "name": "Sistemas totalitários na Europa do século XX: nazifascista, franquismo, salazarismo e stalinismo"
          },
          {
            "id": "hum-s346",
            "name": "Ditaduras políticas na América Latina: Estado Novo no Brasil e ditaduras na América"
          },
          {
            "id": "hum-s347",
            "name": "Conflitos político-culturais pós-Guerra Fria, reorganização política internacional e os organismos multilaterais nos séculos XX e XXI"
          },
          {
            "id": "hum-s348",
            "name": "Luta pela conquista de direitos pelos cidadãos: direitos civis, humanos, políticos e sociais"
          },
          {
            "id": "hum-s349",
            "name": "Direitos sociais nas constituições brasileiras"
          },
          {
            "id": "hum-s350",
            "name": "Políticas afirmativas"
          },
          {
            "id": "hum-s351",
            "name": "Vida urbana: redes e hierarquia nas cidades, pobreza e segregação espacial"
          }
        ]
      },
      {
        "id": "hum-t39",
        "name": "Características e transformações das estruturas produtivas",
        "subtopics": [
          {
            "id": "hum-s352",
            "name": "Diferentes formas de organização da produção: escravismo antigo, feudalismo, capitalismo, socialismo e suas diferentes experiências"
          },
          {
            "id": "hum-s353",
            "name": "Economia agroexportadora brasileira: complexo açucareiro, mineração no período colonial, economia cafeeira e borracha na Amazônia"
          },
          {
            "id": "hum-s354",
            "name": "Revolução Industrial: criação do sistema de fábrica na Europa e transformações no processo de produção"
          },
          {
            "id": "hum-s355",
            "name": "Formação do espaço urbano-industrial"
          },
          {
            "id": "hum-s356",
            "name": "Transformações na estrutura produtiva no século XX: fordismo, toyotismo, novas técnicas de produção e seus impactos"
          },
          {
            "id": "hum-s357",
            "name": "Industrialização brasileira, urbanização e transformações sociais e trabalhistas"
          },
          {
            "id": "hum-s358",
            "name": "Globalização e novas tecnologias de telecomunicação e suas consequências econômicas, políticas e sociais"
          },
          {
            "id": "hum-s359",
            "name": "Produção e transformação dos espaços agrários"
          },
          {
            "id": "hum-s360",
            "name": "Modernização da agricultura e estruturas agrárias tradicionais"
          },
          {
            "id": "hum-s361",
            "name": "Agronegócio, agricultura familiar, assalariados do campo e lutas sociais no campo"
          },
          {
            "id": "hum-s362",
            "name": "Relação campo-cidade"
          }
        ]
      },
      {
        "id": "hum-t40",
        "name": "Os domínios naturais e a relação do ser humano com o ambiente",
        "subtopics": [
          {
            "id": "hum-s363",
            "name": "Relação homem-natureza e a apropriação dos recursos naturais pelas sociedades ao longo do tempo"
          },
          {
            "id": "hum-s364",
            "name": "Impacto ambiental das atividades econômicas no Brasil"
          },
          {
            "id": "hum-s365",
            "name": "Recursos minerais e energéticos: exploração e impactos"
          },
          {
            "id": "hum-s366",
            "name": "Recursos hídricos"
          },
          {
            "id": "hum-s367",
            "name": "Bacias hidrográficas e seus aproveitamentos"
          },
          {
            "id": "hum-s368",
            "name": "Questões ambientais contemporâneas: mudança climática, ilhas de calor, efeito estufa, chuva ácida, destruição da camada de ozônio"
          },
          {
            "id": "hum-s369",
            "name": "Nova ordem ambiental internacional"
          },
          {
            "id": "hum-s370",
            "name": "Políticas territoriais ambientais"
          },
          {
            "id": "hum-s371",
            "name": "Uso e conservação dos recursos naturais, unidades de conservação, corredores ecológicos, zoneamento ecológico e econômico"
          },
          {
            "id": "hum-s372",
            "name": "Origem e evolução do conceito de sustentabilidade"
          },
          {
            "id": "hum-s373",
            "name": "Estrutura interna da terra"
          },
          {
            "id": "hum-s374",
            "name": "Estruturas do solo e do relevo"
          },
          {
            "id": "hum-s375",
            "name": "Agentes internos e externos modeladores do relevo"
          },
          {
            "id": "hum-s376",
            "name": "Situação geral da atmosfera e classificação climática"
          },
          {
            "id": "hum-s377",
            "name": "Características climáticas do território brasileiro"
          },
          {
            "id": "hum-s378",
            "name": "Grandes domínios da vegetação no Brasil e no mundo"
          }
        ]
      },
      {
        "id": "hum-t41",
        "name": "Representação espacial",
        "subtopics": [
          {
            "id": "hum-s379",
            "name": "\"Projeções cartográficas"
          }
        ]
      }
    ]
  }
];

// Aplicar status padrão nos subtópicos
INITIAL_AREAS.forEach(area => {
  area.topics.forEach(topic => {
    topic.subtopics = topic.subtopics.map(s => sub(s.id, s.name));
  });
});
