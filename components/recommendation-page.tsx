"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home, RotateCcw, AlertTriangle, Info } from "lucide-react"
import type { PatientData } from "./patient-form"

interface LogEntry {
  step: number
  question: string
  answer: string
  timestamp: string
  nodeId: string
  sourceReference?: string
  clinicalInfo?: string
}

interface RecommendationPageProps {
  recommendations: any[]
  questionnaireTitle: string
  patientData: PatientData
  log: LogEntry[]
  onRestart: () => void
  onBackToHome: () => void
  onDownloadLog: () => void
  metadata?: any
}

export default function RecommendationPage({
  recommendations,
  questionnaireTitle,
  patientData,
  log,
  onRestart,
  onBackToHome,
  onDownloadLog,
  metadata,
}: RecommendationPageProps) {
  const hasPatientData = patientData.gender !== "not_specified"

  const renderRecommendation = (rec: any, index: number) => {
    if (rec.type === "recommendation" || rec.type === "key_recommendation" || rec.type === "detailed_recommendation") {
      const bgColor = rec.type === "key_recommendation" ? "bg-green-50 border-green-500" : "bg-blue-50 border-blue-500"
      const icon = rec.type === "key_recommendation" ? "⭐" : "📌"

      return (
        <div key={index} className={`flex items-start p-4 border-l-4 rounded shadow-sm ${bgColor}`}>
          <div className="flex-shrink-0 text-2xl mr-3">{icon}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">{rec.type.replace("_", " ").toUpperCase()}</p>
            <p className="text-gray-800">{rec.text}</p>
          </div>
        </div>
      )
    }

    if (rec.type === "treatment_protocol") {
      const p = rec.data
      return (
        <div key={index} className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
              Rx
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-purple-900">{p.type || "Протокол лечения"}</h3>
              {p.location && (
                <p className="text-sm">
                  <strong>Локализация:</strong> {p.location}
                </p>
              )}
              {p.anatomical_note && (
                <p className="text-sm">
                  <strong>Анатомическая заметка:</strong> {p.anatomical_note}
                </p>
              )}
              {p.detailed_description && (
                <div className="text-sm bg-white p-3 rounded border border-purple-200">
                  <strong className="text-purple-800">Детальное описание:</strong>
                  <p className="mt-1 text-gray-700">{p.detailed_description}</p>
                </div>
              )}
              {p.surgical_method && (
                <p className="text-sm">
                  <strong>Хирургический метод:</strong> {p.surgical_method}
                </p>
              )}
              {p.alternative && (
                <p className="text-sm">
                  <strong>Альтернатива:</strong> {p.alternative}
                </p>
              )}
              {p.implementation && (
                <p className="text-sm">
                  <strong>Реализация:</strong> {p.implementation}
                </p>
              )}
              {p.indications && (
                <p className="text-sm">
                  <strong>Показания:</strong> {p.indications}
                </p>
              )}
              {p.contraindications && (
                <p className="text-sm">
                  <strong>Противопоказания:</strong> {p.contraindications}
                </p>
              )}
              {p.timing && (
                <p className="text-sm">
                  <strong>Время:</strong> {p.timing}
                </p>
              )}
              {p.weight_bearing && (
                <p className="text-sm">
                  <strong>Режим нагрузки:</strong> {p.weight_bearing}
                </p>
              )}
              {p.progression && (
                <p className="text-sm">
                  <strong>Прогрессия:</strong> {p.progression}
                </p>
              )}
              {p.immobilization && (
                <p className="text-sm">
                  <strong>Иммобилизация:</strong> {p.immobilization}
                </p>
              )}
              {p.rehabilitation && (
                <div className="text-sm bg-green-50 p-2 rounded border border-green-200">
                  <strong className="text-green-800">Реабилитация:</strong>
                  <p className="mt-1">{p.rehabilitation}</p>
                </div>
              )}
              {p.method && (
                <p className="text-sm">
                  <strong>Метод:</strong> {p.method}
                </p>
              )}
              {p.age_specifics && (
                <p className="text-sm">
                  <strong>Возрастные особенности:</strong> {p.age_specifics}
                </p>
              )}
              {p.indication && (
                <p className="text-sm">
                  <strong>Показание:</strong> {p.indication}
                </p>
              )}
              {p.early_phase && (
                <p className="text-sm">
                  <strong>Ранняя фаза:</strong> {p.early_phase}
                </p>
              )}
              {p.late_phase && (
                <p className="text-sm">
                  <strong>Поздняя фаза:</strong> {p.late_phase}
                </p>
              )}
              {p.phase_description && (
                <p className="text-sm">
                  <strong>Описание фазы:</strong> {p.phase_description}
                </p>
              )}
              {p.measures && (
                <p className="text-sm">
                  <strong>Меры:</strong> {p.measures}
                </p>
              )}
              {p.objectives && Array.isArray(p.objectives) && (
                <div className="text-sm">
                  <strong>Цели:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {p.objectives.map((obj: string, i: number) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (rec.type === "therapeutic_measure") {
      const m = rec.data
      return (
        <div key={index} className="p-4 bg-teal-50 border-l-4 border-teal-500 rounded shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-teal-900">{m.measure || "Терапевтическая мера"}</h3>
              {m.timing && (
                <p className="text-sm">
                  <strong>Время:</strong> {m.timing}
                </p>
              )}
              {m.details && <p className="text-sm text-gray-700">{m.details}</p>}
              {m.implementation && (
                <p className="text-sm">
                  <strong>Реализация:</strong> {m.implementation}
                </p>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (rec.type === "prevention_measure") {
      const m = rec.data
      return (
        <div key={index} className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
              P
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-indigo-900">{m.measure || "Профилактическая мера"}</h3>
              {m.implementation && <p className="text-sm text-gray-700">{m.implementation}</p>}
            </div>
          </div>
        </div>
      )
    }

    if (rec.type === "critical_rule") {
      const r = rec.data
      return (
        <div key={index} className="p-4 bg-red-50 border-l-4 border-red-500 rounded shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-red-900">⚠️ КРИТИЧЕСКОЕ ПРАВИЛО</h3>
              {r.rule && <p className="text-sm font-semibold text-red-800">{r.rule}</p>}
              {r.warning && (
                <div className="text-sm text-red-700 bg-white p-3 rounded border border-red-300 mt-2">
                  <strong>Предупреждение:</strong> {r.warning}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (rec.type === "risk_factor") {
      return (
        <div key={index} className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded shadow-sm">
          <p className="text-sm">
            <strong className="text-orange-900">Фактор риска:</strong> {rec.text}
          </p>
        </div>
      )
    }

    return (
      <div key={index} className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded shadow-sm">
        <p className="text-gray-800">{rec.text || JSON.stringify(rec)}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Диагностика завершена</h1>
        </div>

        {/* Metadata */}
        {metadata && (
          <Card className="mb-6 bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Информация об опроснике</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Название:</strong> {metadata.title}
                </p>
                {metadata.subtitle && (
                  <p>
                    <strong>Подзаголовок:</strong> {metadata.subtitle}
                  </p>
                )}
                {metadata.source_document && (
                  <p>
                    <strong>Источник:</strong> {metadata.source_document}
                  </p>
                )}
                {metadata.year && (
                  <p>
                    <strong>Год:</strong> {metadata.year}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient Summary */}
        {hasPatientData && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Данные пациента</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Опросник:</span>
                  <span className="ml-2 text-gray-900">{questionnaireTitle}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Дата:</span>
                  <span className="ml-2 text-gray-900">{new Date().toLocaleDateString("ru-RU")}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Пол:</span>
                  <span className="ml-2 text-gray-900">{patientData.gender === "male" ? "Мужской" : "Женский"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Возраст:</span>
                  <span className="ml-2 text-gray-900">{patientData.age} лет</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Вес:</span>
                  <span className="ml-2 text-gray-900">{patientData.weight} кг</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Хронические болезни:</span>
                  <span className="ml-2 text-gray-900">{patientData.chronicDiseases || "Не указаны"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-green-100">
            <CardTitle className="text-2xl text-green-900">Клинические рекомендации</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">{recommendations.map((rec, index) => renderRecommendation(rec, index))}</div>
          </CardContent>
        </Card>

        {/* Diagnostic Path */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Путь диагностики</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {log.map((entry, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4 py-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-700">Шаг {entry.step}</span>
                    <span className="text-xs text-gray-500">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{entry.question}</p>
                  <p className="text-sm text-blue-600 font-medium">→ {entry.answer}</p>
                  {entry.sourceReference && (
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Источник:</strong> {entry.sourceReference}
                    </p>
                  )}
                  {entry.clinicalInfo && (
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Клин. инфо:</strong> {entry.clinicalInfo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" size="lg" onClick={onDownloadLog}>
            <Download className="w-5 h-5 mr-2" />
            Скачать полный отчет
          </Button>
          <Button variant="outline" size="lg" onClick={onRestart}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Пройти заново
          </Button>
          <Button variant="outline" size="lg" onClick={onBackToHome}>
            <Home className="w-5 h-5 mr-2" />
            На главную
          </Button>
        </div>

        {/* Important Note */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Важная информация</h3>
          <p className="text-sm text-yellow-800">
            Данные рекомендации основаны на клинических протоколах и предназначены для поддержки принятия врачебных
            решений. Окончательное решение о лечении должно приниматься врачом с учетом всех индивидуальных особенностей
            пациента.
          </p>
        </div>
      </div>
    </div>
  )
}
