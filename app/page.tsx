"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import rehabilitationTree from "@/public/rehabilitation-tree-2.json"

interface Answer {
  text: string
  next_node_id: string
}

interface Option {
  text: string
  next_node_id: string
}

interface TreatmentProtocol {
  type?: string
  location?: string
  surgical_method?: string
  weight_bearing?: string
  after_12weeks?: string
  movement_restrictions?: string
  detailed_description?: string
}

interface TreeNode {
  id: string
  type: string
  question?: string
  source_reference?: string
  answers?: Answer[]
  options?: Option[]
  clinical_info?: { objective?: string; evidence?: string }
  treatment_protocols?: TreatmentProtocol[]
  treatment_options?: Array<{ option?: string; recommendation?: string }>
  treatment_recommendation?: string
  surgical_options?: Array<{ method?: string; advantage?: string; disadvantage?: string; evidence?: string }>
  characteristics?: Record<string, string>
  weight_bearing?: string
  surgical_recommendation?: string
  fixation_modes?: Array<{ mode?: string; definition?: string; suitable_for?: string; weight_bearing?: string }>
  day_by_day_protocol?: Array<{
    day?: string
    objectives?: string[]
    exercises?: Array<{ name: string; frequency?: string; duration?: string }>
  }>
  walking_technique?: Record<string, unknown>
  risk_factors?: string[]
  prevention_measures?: Array<{ measure?: string; implementation?: string }>
  vas_scale?: Record<string, string>
  pain_management_protocol?: Array<{ vas_score?: string; intensity?: string; action?: string; treatment?: string[] }>
  epidemiology?: string
  transfusion_threshold?: Record<string, string>
  evidence?: string
  main_objectives?: string[]
  therapeutic_measures?: Array<{ measure?: string; timing?: string; methods?: string[] }>
  therapeutic_options?: Array<{
    therapy?: string
    types?: string[]
    timing?: string
    frequency?: string
    duration?: string
  }>
  patient_instructions?: Record<string, unknown>
  critical_rules?: Array<{ rule?: string; warning?: string; content?: string }>
  message?: string
  key_recommendations?: string[]
}

interface HistoryItem {
  nodeId: string
  question: string
  answer: string
}

export default function RehabilitationAdvisor() {
  const [currentNodeId, setCurrentNodeId] = useState<string>("root")
  const [history, setHistory] = useState<HistoryItem[]>([])

  const currentNode = useMemo(() => {
    if (currentNodeId === "root") {
      return rehabilitationTree.root as TreeNode
    }
    return (rehabilitationTree.nodes as Record<string, TreeNode>)[currentNodeId]
  }, [currentNodeId])

  const handleSelectAnswer = (nextNodeId: string, answerText: string) => {
    if (currentNode.question) {
      setHistory([
        ...history,
        {
          nodeId: currentNodeId,
          question: currentNode.question,
          answer: answerText,
        },
      ])
    }
    setCurrentNodeId(nextNodeId)
  }

  const handleBackOneStep = () => {
    if (history.length > 0) {
      const previousHistory = history.slice(0, -1)
      const previousNodeId = history[history.length - 1].nodeId

      setHistory(previousHistory)
      setCurrentNodeId(previousNodeId)
    }
  }

  const handleReset = () => {
    setCurrentNodeId("root")
    setHistory([])
  }

  const isEndNode = currentNode?.type === "summary_node"
  const isDecisionNode = currentNode?.type === "decision_node" || currentNode?.type === "assessment_node"
  const isTreatmentNode = currentNode?.type === "treatment_node" || currentNode?.type === "management_node"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {rehabilitationTree.metadata?.title || "Советник по реабилитации"}
          </h1>
          <p className="text-lg text-slate-600">{rehabilitationTree.metadata?.subtitle}</p>
          <p className="text-sm text-slate-500 mt-2">
            Источник: {rehabilitationTree.metadata?.source_document} ({rehabilitationTree.metadata?.year})
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* История диалога */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">История консультации</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 pr-4">
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-500">Начните с выбора этапа лечения пациента</p>
                  ) : (
                    <div className="space-y-4">
                      {history.map((item, index) => (
                        <div key={index} className="border-b pb-3">
                          <p className="text-sm font-medium text-slate-700 mb-1">
                            {index + 1}. {item.question}
                          </p>
                          <p className="text-sm text-blue-600 break-words">✓ {item.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <Button onClick={handleReset} variant="outline" className="w-full mt-4 bg-white hover:bg-blue-50">
                  Начать заново
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{isEndNode ? "Итоги консультации" : isDecisionNode ? "Вопрос" : "Рекомендации"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Основной вопрос */}
                  <div>
                    <p className="text-lg font-semibold text-slate-900 mb-4">{currentNode?.question}</p>
                    {currentNode?.source_reference && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-amber-900 italic">📚 {currentNode.source_reference}</p>
                      </div>
                    )}
                  </div>

                  {/* Информация о клинической цели */}
                  {currentNode?.clinical_info && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-blue-900">
                        <strong>Цель:</strong> {currentNode.clinical_info.objective}
                      </p>
                      <p className="text-sm text-blue-900">
                        <strong>Уровень доказательности:</strong> {currentNode.clinical_info.evidence}
                      </p>
                    </div>
                  )}

                  {/* Протоколы лечения */}
                  {currentNode?.treatment_protocols && currentNode.treatment_protocols.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900">Протоколы лечения:</h4>
                      {currentNode.treatment_protocols.map((protocol, idx) => (
                        <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                          {protocol.type && <p className="font-semibold text-green-900">{protocol.type}</p>}
                          {protocol.location && (
                            <p className="text-sm text-green-800">
                              <strong>Локализация:</strong> {protocol.location}
                            </p>
                          )}
                          {protocol.surgical_method && (
                            <p className="text-sm text-green-800">
                              <strong>Метод:</strong> {protocol.surgical_method}
                            </p>
                          )}
                          {protocol.weight_bearing && (
                            <p className="text-sm text-green-800">
                              <strong>Нагрузка:</strong> {protocol.weight_bearing}
                            </p>
                          )}
                          {protocol.movement_restrictions && (
                            <p className="text-sm text-green-800">
                              <strong>Ограничения:</strong> {protocol.movement_restrictions}
                            </p>
                          )}
                          {protocol.detailed_description && (
                            <p className="text-sm text-green-800 border-t pt-2 mt-2">
                              <strong>Подробно:</strong> {protocol.detailed_description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Рисковые факторы */}
                  {currentNode?.risk_factors && currentNode.risk_factors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">Факторы риска:</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        {currentNode.risk_factors.map((factor, idx) => (
                          <li key={idx}>• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Меры профилактики */}
                  {currentNode?.prevention_measures && currentNode.prevention_measures.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">Меры профилактики:</h4>
                      <ul className="text-sm text-purple-800 space-y-2">
                        {currentNode.prevention_measures.map((measure, idx) => (
                          <li key={idx}>
                            <strong>• {measure.measure}</strong>: {measure.implementation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Основные цели */}
                  {currentNode?.main_objectives && currentNode.main_objectives.length > 0 && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-900 mb-2">Основные цели:</h4>
                      <ul className="text-sm text-indigo-800 space-y-1">
                        {currentNode.main_objectives.map((obj, idx) => (
                          <li key={idx}>• {obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ключевые рекомендации */}
                  {currentNode?.key_recommendations && currentNode.key_recommendations.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Ключевые рекомендации:</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        {currentNode.key_recommendations.map((rec, idx) => (
                          <li key={idx}>✓ {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Варианты ответов */}
                  {(currentNode?.answers || currentNode?.options) && (
                    <div className="space-y-3 pt-4 border-t">
                      {(currentNode.answers || currentNode.options)?.map((item) => (
                        <Button
                          key={item.next_node_id}
                          onClick={() => handleSelectAnswer(item.next_node_id, item.text)}
                          variant="outline"
                          className="w-full justify-start h-auto py-3 px-4 text-left hover:bg-blue-100 hover:border-blue-300"
                        >
                          <span className="text-base">{item.text}</span>
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Кнопка Назад */}
                  {history.length > 0 && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleBackOneStep} variant="secondary" className="flex-1">
                        ← Вернуться на шаг обратно
                      </Button>
                      {history.length > 1 && (
                        <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                          ↺ К началу
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Метаинформация */}
            {rehabilitationTree.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ℹ️ О системе</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2">
                  <p>
                    <strong>Версия:</strong> {rehabilitationTree.metadata.version}
                  </p>
                  <p>
                    <strong>Тип:</strong> {rehabilitationTree.metadata.structure_type}
                  </p>
                  <p className="text-xs text-slate-500 italic">{rehabilitationTree.metadata.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
