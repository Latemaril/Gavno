"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Download, Info } from "lucide-react"
import type { PatientData } from "./patient-form"
import RecommendationPage from "./recommendation-page"

interface QuestionnaireProps {
  questionnaireFile: string
  questionnaireTitle: string
  patientData: PatientData
  onBackToHome: () => void
}

interface Answer {
  text: string
  next_node_id: string
}

interface Option {
  text: string
  next_node_id?: string
}

interface ClinicalInfo {
  objective?: string
  evidence?: string
}

interface TreatmentProtocol {
  type?: string
  location?: string
  anatomical_note?: string
  detailed_description?: string
  surgical_method?: string
  alternative?: string
  implementation?: string
  indications?: string
  contraindications?: string
  objectives?: string[]
  timing?: string
  weight_bearing?: string
  progression?: string
  immobilization?: string
  rehabilitation?: string
  method?: string
  age_specifics?: string
  indication?: string
  early_phase?: string
  late_phase?: string
  phase_description?: string
  measures?: string
}

interface TherapeuticMeasure {
  measure?: string
  timing?: string
  details?: string
  implementation?: string
}

interface PreventionMeasure {
  measure?: string
  implementation?: string
}

interface CriticalRule {
  rule?: string
  warning?: string
}

interface Node {
  id: string
  type: string
  question?: string
  source_reference?: string
  clinical_info?: ClinicalInfo
  answers?: Answer[]
  options?: Option[]
  recommendations?: string[]
  treatment_protocols?: TreatmentProtocol[]
  therapeutic_measures?: TherapeuticMeasure[]
  prevention_measures?: PreventionMeasure[]
  critical_rules?: CriticalRule[]
  key_recommendations?: string[]
  detailed_recommendations?: string[]
  risk_factors?: string[]
}

interface QuestionnaireData {
  metadata: {
    title: string
    subtitle: string
    source_document?: string
    year?: number
  }
  root: Node
  nodes: Record<string, Node>
}

interface LogEntry {
  step: number
  question: string
  answer: string
  timestamp: string
  nodeId: string
  sourceReference?: string
  clinicalInfo?: string
}

export default function Questionnaire({
  questionnaireFile,
  questionnaireTitle,
  patientData,
  onBackToHome,
}: QuestionnaireProps) {
  const [data, setData] = useState<QuestionnaireData | null>(null)
  const [currentNodeId, setCurrentNodeId] = useState<string>("root")
  const [history, setHistory] = useState<string[]>(["root"])
  const [log, setLog] = useState<LogEntry[]>([])
  const [recommendations, setRecommendations] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const hasPatientData = patientData.gender !== "not_specified"

  const handleRestart = () => {
    setCurrentNodeId("root")
    setHistory(["root"])
    setLog([])
    setRecommendations(null)
  }

  useEffect(() => {
    setIsLoading(true)
    fetch(questionnaireFile)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load ${questionnaireFile}`)
        }
        return res.json()
      })
      .then((jsonData) => {
        console.log("[v0] Loaded questionnaire data:", jsonData)
        setData(jsonData)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Error loading questionnaire:", err)
        setIsLoading(false)
      })
  }, [questionnaireFile])

  const collectAllRecommendations = (node: Node): any[] => {
    const allRecs: any[] = []

    // Базовые рекомендации
    if (node.recommendations && node.recommendations.length > 0) {
      node.recommendations.forEach((rec) => {
        allRecs.push({ type: "recommendation", text: rec })
      })
    }

    // Ключевые рекомендации
    if (node.key_recommendations && node.key_recommendations.length > 0) {
      node.key_recommendations.forEach((rec) => {
        allRecs.push({ type: "key_recommendation", text: rec })
      })
    }

    // Детальные рекомендации
    if (node.detailed_recommendations && node.detailed_recommendations.length > 0) {
      node.detailed_recommendations.forEach((rec) => {
        allRecs.push({ type: "detailed_recommendation", text: rec })
      })
    }

    // Протоколы лечения
    if (node.treatment_protocols && node.treatment_protocols.length > 0) {
      node.treatment_protocols.forEach((protocol: TreatmentProtocol) => {
        allRecs.push({ type: "treatment_protocol", data: protocol })
      })
    }

    // Терапевтические меры
    if (node.therapeutic_measures && node.therapeutic_measures.length > 0) {
      node.therapeutic_measures.forEach((measure: TherapeuticMeasure) => {
        allRecs.push({ type: "therapeutic_measure", data: measure })
      })
    }

    // Меры профилактики
    if (node.prevention_measures && node.prevention_measures.length > 0) {
      node.prevention_measures.forEach((measure: PreventionMeasure) => {
        allRecs.push({ type: "prevention_measure", data: measure })
      })
    }

    // Критические правила
    if (node.critical_rules && node.critical_rules.length > 0) {
      node.critical_rules.forEach((rule: CriticalRule) => {
        allRecs.push({ type: "critical_rule", data: rule })
      })
    }

    // Факторы риска
    if (node.risk_factors && node.risk_factors.length > 0) {
      node.risk_factors.forEach((factor: string) => {
        allRecs.push({ type: "risk_factor", text: factor })
      })
    }

    return allRecs
  }

  const isTerminalNode = (node: Node): boolean => {
    if (!node) return false

    // Если есть answers или options с next_node_id - узел НЕ терминальный, продолжаем опрос
    const hasNextOptions = node.answers && node.answers.length > 0
    const hasNextFromOptions = node.options && node.options.some((o) => o.next_node_id)

    if (hasNextOptions || hasNextFromOptions) {
      return false
    }

    // Если нет способов продолжить И есть рекомендации - это терминальный узел
    const hasRecommendations =
      (node.recommendations && node.recommendations.length > 0) ||
      (node.key_recommendations && node.key_recommendations.length > 0) ||
      (node.detailed_recommendations && node.detailed_recommendations.length > 0) ||
      (node.treatment_protocols && node.treatment_protocols.length > 0) ||
      (node.therapeutic_measures && node.therapeutic_measures.length > 0) ||
      (node.prevention_measures && node.prevention_measures.length > 0)

    return hasRecommendations
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Загрузка опросника...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Ошибка загрузки</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Не удалось загрузить опросник</p>
            <Button onClick={onBackToHome}>Вернуться на главную</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentNode = currentNodeId === "root" ? data.root : data.nodes[currentNodeId]

  if (!currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Ошибка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Узел не найден: {currentNodeId}</p>
            <Button onClick={handleRestart}>Начать заново</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAnswer = (answer: Answer | Option, isOption = false) => {
    console.log("[v0] handleAnswer called with:", { answer, isOption, currentNode: currentNodeId })

    // Формирование строки с клинической информацией
    let clinicalInfoStr = ""
    if (currentNode.clinical_info) {
      const parts = []
      if (currentNode.clinical_info.objective) {
        parts.push(`Цель: ${currentNode.clinical_info.objective}`)
      }
      if (currentNode.clinical_info.evidence) {
        parts.push(`Уровень доказательности: ${currentNode.clinical_info.evidence}`)
      }
      clinicalInfoStr = parts.join(" | ")
    }

    const newLogEntry: LogEntry = {
      step: log.length + 1,
      question: currentNode.question || "Выбор варианта",
      answer: answer.text,
      timestamp: new Date().toLocaleString("ru-RU"),
      nodeId: currentNodeId,
      sourceReference: currentNode.source_reference,
      clinicalInfo: clinicalInfoStr || undefined,
    }

    const updatedLog = [...log, newLogEntry]
    setLog(updatedLog)

    if (!answer.next_node_id) {
      console.log("[v0] No next_node_id found, checking if terminal node")
      // Если нет next_node_id - проверяем терминальность текущего узла
      if (isTerminalNode(currentNode)) {
        const collectedRecs = collectAllRecommendations(currentNode)
        console.log("[v0] Terminal node without next_node_id. Recommendations:", collectedRecs)
        if (collectedRecs.length > 0) {
          setRecommendations(collectedRecs)
        }
      }
      return
    }

    console.log("[v0] Moving to next node:", answer.next_node_id)

    const updatedHistory = [...history, answer.next_node_id]
    setHistory(updatedHistory)

    const nextNode = data.nodes[answer.next_node_id]

    if (!nextNode) {
      console.log("[v0] Next node not found:", answer.next_node_id)
      setRecommendations([
        { type: "error", text: `Диагностика завершена. Узел "${answer.next_node_id}" не найден в данных.` },
      ])
      return
    }

    console.log(
      "[v0] Next node found:",
      nextNode.id,
      "Type:",
      nextNode.type,
      "Has answers:",
      !!nextNode.answers,
      "Has options:",
      !!nextNode.options,
    )

    if (isTerminalNode(nextNode)) {
      const collectedRecs = collectAllRecommendations(nextNode)
      console.log("[v0] Terminal node reached. Recommendations:", collectedRecs)

      if (collectedRecs.length > 0) {
        setRecommendations(collectedRecs)
      } else {
        setRecommendations([{ type: "info", text: "Диагностика завершена. Рекомендации не найдены." }])
      }
    } else {
      console.log("[v0] Not a terminal node, continuing to:", answer.next_node_id)
      setCurrentNodeId(answer.next_node_id)
    }
  }

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      const newLog = log.slice(0, -1)
      setHistory(newHistory)
      setLog(newLog)
      setCurrentNodeId(newHistory[newHistory.length - 1])
      setRecommendations(null)
    }
  }

  const handleDownloadLog = () => {
    const logContent = generateLogContent()
    const blob = new Blob([logContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `log_${questionnaireTitle.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateLogContent = () => {
    let content = "═══════════════════════════════════════════════════════════\n"
    content += "           МЕДИЦИНСКИЙ ДИАГНОСТИЧЕСКИЙ ЛОГ\n"
    content += "═══════════════════════════════════════════════════════════\n\n"

    content += "ОПРОСНИК: " + questionnaireTitle + "\n"
    if (data?.metadata.source_document) {
      content += "ИСТОЧНИК: " + data.metadata.source_document + "\n"
    }
    if (data?.metadata.year) {
      content += "ГОД: " + data.metadata.year + "\n"
    }
    content += "ДАТА ПРОХОЖДЕНИЯ: " + new Date().toLocaleString("ru-RU") + "\n\n"

    if (hasPatientData) {
      content += "───────────────────────────────────────────────────────────\n"
      content += "ДАННЫЕ ПАЦИЕНТА\n"
      content += "───────────────────────────────────────────────────────────\n"
      content += `Пол: ${patientData.gender === "male" ? "Мужской" : "Женский"}\n`
      content += `Возраст: ${patientData.age} лет\n`
      content += `Вес: ${patientData.weight} кг\n`
      content += `Хронические заболевания: ${patientData.chronicDiseases || "Не указаны"}\n\n`
    }

    content += "───────────────────────────────────────────────────────────\n"
    content += "ПУТЬ ДИАГНОСТИКИ\n"
    content += "───────────────────────────────────────────────────────────\n\n"

    log.forEach((entry) => {
      content += `Шаг ${entry.step} [${entry.timestamp}]\n`
      content += `  Узел: ${entry.nodeId}\n`
      if (entry.sourceReference) {
        content += `  Источник: ${entry.sourceReference}\n`
      }
      content += `  Вопрос: ${entry.question}\n`
      content += `  Ответ: ${entry.answer}\n`
      if (entry.clinicalInfo) {
        content += `  Клиническая информация: ${entry.clinicalInfo}\n`
      }
      content += "\n"
    })

    if (recommendations && recommendations.length > 0) {
      content += "═══════════════════════════════════════════════════════════\n"
      content += "ИТОГОВЫЕ КЛИНИЧЕСКИЕ РЕКОМЕНДАЦИИ\n"
      content += "═══════════════════════════════════════════════════════════\n\n"

      recommendations.forEach((rec, index) => {
        if (
          rec.type === "recommendation" ||
          rec.type === "key_recommendation" ||
          rec.type === "detailed_recommendation"
        ) {
          content += `${index + 1}. [${rec.type.toUpperCase()}] ${rec.text}\n\n`
        } else if (rec.type === "treatment_protocol") {
          const p = rec.data
          content += `${index + 1}. ПРОТОКОЛ ЛЕЧЕНИЯ\n`
          if (p.type) content += `   Тип: ${p.type}\n`
          if (p.location) content += `   Локализация: ${p.location}\n`
          if (p.anatomical_note) content += `   Анатомическая заметка: ${p.anatomical_note}\n`
          if (p.detailed_description) content += `   Детальное описание: ${p.detailed_description}\n`
          if (p.surgical_method) content += `   Хирургический метод: ${p.surgical_method}\n`
          if (p.alternative) content += `   Альтернатива: ${p.alternative}\n`
          if (p.implementation) content += `   Реализация: ${p.implementation}\n`
          if (p.indications) content += `   Показания: ${p.indications}\n`
          if (p.contraindications) content += `   Противопоказания: ${p.contraindications}\n`
          if (p.timing) content += `   Время: ${p.timing}\n`
          if (p.weight_bearing) content += `   Нагрузка: ${p.weight_bearing}\n`
          if (p.progression) content += `   Прогрессия: ${p.progression}\n`
          if (p.immobilization) content += `   Иммобилизация: ${p.immobilization}\n`
          if (p.rehabilitation) content += `   Реабилитация: ${p.rehabilitation}\n`
          if (p.method) content += `   Метод: ${p.method}\n`
          if (p.age_specifics) content += `   Возрастные особенности: ${p.age_specifics}\n`
          if (p.indication) content += `   Показание: ${p.indication}\n`
          if (p.early_phase) content += `   Ранняя фаза: ${p.early_phase}\n`
          if (p.late_phase) content += `   Поздняя фаза: ${p.late_phase}\n`
          if (p.phase_description) content += `   Описание фазы: ${p.phase_description}\n`
          if (p.measures) content += `   Меры: ${p.measures}\n`
          if (p.objectives && Array.isArray(p.objectives)) {
            content += `   Цели операции:\n`
            p.objectives.forEach((obj: string) => {
              content += `     - ${obj}\n`
            })
          }
          content += "\n"
        } else if (rec.type === "therapeutic_measure") {
          const m = rec.data
          content += `${index + 1}. ТЕРАПЕВТИЧЕСКАЯ МЕРА\n`
          if (m.measure) content += `   Мера: ${m.measure}\n`
          if (m.timing) content += `   Время: ${m.timing}\n`
          if (m.details) content += `   Детали: ${m.details}\n`
          if (m.implementation) content += `   Реализация: ${m.implementation}\n`
          content += "\n"
        } else if (rec.type === "prevention_measure") {
          const m = rec.data
          content += `${index + 1}. ПРОФИЛАКТИЧЕСКАЯ МЕРА\n`
          if (m.measure) content += `   Мера: ${m.measure}\n`
          if (m.implementation) content += `   Реализация: ${m.implementation}\n`
          content += "\n"
        } else if (rec.type === "critical_rule") {
          const r = rec.data
          content += `${index + 1}. ⚠️ КРИТИЧЕСКОЕ ПРАВИЛО / ПРОТИВОПОКАЗАНИЕ\n`
          if (r.rule) content += `   Правило: ${r.rule}\n`
          if (r.warning) content += `   Предупреждение: ${r.warning}\n`
          content += "\n"
        } else if (rec.type === "risk_factor") {
          content += `${index + 1}. ФАКТОР РИСКА: ${rec.text}\n\n`
        }
      })
    }

    content += "───────────────────────────────────────────────────────────\n"
    content += "Конец отчета\n"
    content += "───────────────────────────────────────────────────────────\n"

    return content
  }

  if (recommendations) {
    return (
      <RecommendationPage
        recommendations={recommendations}
        questionnaireTitle={questionnaireTitle}
        patientData={patientData}
        log={log}
        onRestart={handleRestart}
        onBackToHome={onBackToHome}
        onDownloadLog={handleDownloadLog}
        metadata={data.metadata}
      />
    )
  }

  const answers = currentNode.answers || []
  const options = currentNode.options || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{questionnaireTitle}</h1>
            <p className="text-sm text-gray-600 mt-1">Шаг {history.length} из опроса</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRestart} size="sm">
              <Home className="w-4 h-4 mr-2" />В начало
            </Button>
            <Button variant="outline" onClick={onBackToHome} size="sm">
              Выход
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.min((history.length / 20) * 100, 100)}%` }}
          />
        </div>

        {/* Patient Info Card */}
        {hasPatientData && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Пол:</span>
                  <span className="ml-2 text-gray-900">{patientData.gender === "male" ? "М" : "Ж"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Возраст:</span>
                  <span className="ml-2 text-gray-900">{patientData.age} лет</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Вес:</span>
                  <span className="ml-2 text-gray-900">{patientData.weight} кг</span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="font-semibold text-gray-700">Болезни:</span>
                  <span className="ml-2 text-gray-900">{patientData.chronicDiseases || "Нет"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{currentNode.question || "Выберите вариант"}</CardTitle>
            {(currentNode.source_reference || currentNode.clinical_info) && (
              <div className="mt-3 space-y-2">
                {currentNode.source_reference && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Источник:</strong> {currentNode.source_reference}
                    </span>
                  </div>
                )}
                {currentNode.clinical_info && (
                  <div className="text-sm bg-blue-50 p-3 rounded">
                    {currentNode.clinical_info.objective && (
                      <p className="mb-1">
                        <strong>Цель:</strong> {currentNode.clinical_info.objective}
                      </p>
                    )}
                    {currentNode.clinical_info.evidence && (
                      <p>
                        <strong>Уровень доказательности:</strong> {currentNode.clinical_info.evidence}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {options.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-600" />
                  Классификация / Варианты оценки:
                </h3>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index}>
                      {option.next_node_id ? (
                        <Button
                          onClick={() => handleAnswer(option, true)}
                          className="w-full justify-start text-left h-auto py-3 px-4 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 transition-colors"
                          variant="outline"
                        >
                          <span className="text-gray-800">{option.text}</span>
                        </Button>
                      ) : (
                        <div className="text-sm text-gray-700 bg-white border border-gray-200 rounded p-3">
                          • {option.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {answers.length > 0 && (
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(answer)}
                    className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-blue-600 hover:text-white transition-colors"
                    variant="outline"
                  >
                    <span className="font-medium">{answer.text}</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        {history.length > 1 && (
          <div className="mt-6 flex justify-center">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться назад
            </Button>
          </div>
        )}

        {/* Log Preview */}
        {log.length > 0 && (
          <Card className="mt-6 bg-gray-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">История ответов</CardTitle>
                <Button variant="outline" size="sm" onClick={handleDownloadLog}>
                  <Download className="w-4 h-4 mr-2" />
                  Скачать лог
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {log.map((entry, index) => (
                  <div key={index} className="text-sm border-l-2 border-blue-400 pl-3 py-2 bg-white rounded">
                    <p className="font-medium text-gray-700">
                      Шаг {entry.step}: {entry.question}
                    </p>
                    <p className="text-gray-600">→ {entry.answer}</p>
                    {entry.sourceReference && (
                      <p className="text-xs text-gray-500 mt-1">Источник: {entry.sourceReference}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
