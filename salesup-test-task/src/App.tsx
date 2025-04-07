import { useRef, useState } from "react";
import { Model, Param, ParamEditor } from "./components/ParamEditor";
import "./App.css";

/**
 * Компонент App для тестирования функциональности ParamEditor
 * Проверяет возможность отображения параметров, их редактирования и получения обновленной модели
 */
function App() {
  // Определяем параметры для редактора
  const testParameters: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" },
    { id: 3, name: "Материал", type: "string" }, // Параметр без значения в исходной модели
  ];

  // Определяем исходную модель со значениями параметров
  const testModel: Model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
      // Значение для id:3 намеренно отсутствует
    ],
    colors: [],
  };

  // Состояние для отслеживания результатов тестирования
  const [testsResult, setTestsResult] = useState<{
    initial: Model | null;
    afterEdit: Model | null;
    initialVsAfterEdit: boolean;
    hasNewParam: boolean;
  }>({
    initial: null,
    afterEdit: null,
    initialVsAfterEdit: false,
    hasNewParam: false,
  });

  // Ссылка на компонент ParamEditor
  const editorRef = useRef<ParamEditor>(null);

  /**
   * Запускает начальные тесты и сохраняет исходное состояние модели
   * Используется для дальнейшего сравнения с измененной моделью
   */
  const startInitialTests = () => {
    if (!editorRef.current) return;

    // Получаем исходную модель из редактора
    const initialResult = editorRef.current.getModel();

    // Сохраняем её для последующего сравнения
    setTestsResult((prevResult) => ({
      ...prevResult,
      initial: initialResult,
    }));

    // Предоставляем инструкции для ручного тестирования
    alert(
      'Теперь измените значения в полях и нажмите "Проверить после изменений"'
    );
  };

  /**
   * Проверяет результаты после редактирования параметров
   * Сравнивает исходную модель с обновленной и выполняет тесты
   */
  const checkAfterEdit = () => {
    if (!editorRef.current || !testsResult.initial) return;

    // Получаем модель после редактирования
    const updatedModel = editorRef.current.getModel();

    // Проверяем, изменилась ли модель после редактирования
    const modelChanged =
      JSON.stringify(testsResult.initial) !== JSON.stringify(updatedModel);

    // Проверяем, был ли добавлен параметр 3 (отсутствовавший в исходной модели)
    const newParameterAdded = updatedModel.paramValues.some(
      (parameter) => parameter.paramId === 3 && parameter.value.length > 0
    );

    // Обновляем результаты тестов
    setTestsResult((prevResult) => ({
      ...prevResult,
      afterEdit: updatedModel,
      initialVsAfterEdit: modelChanged,
      hasNewParam: newParameterAdded,
    }));
  };

  return (
    <div className="test-app-container">
      <h1 className="test-app-title">Тестирование ParamEditor</h1>

      <div className="test-component-container">
        <h2>Компонент для тестирования:</h2>
        <ParamEditor
          ref={editorRef}
          params={testParameters}
          model={testModel}
        />
      </div>

      <div className="test-controls">
        <button onClick={startInitialTests} className="test-button">
          Запустить проверку
        </button>
        <button onClick={checkAfterEdit} className="test-button">
          Проверить после изменений
        </button>
      </div>

      {(testsResult.initial || testsResult.afterEdit) && (
        <div className="test-results">
          <h3 className="results-title">Результаты проверки:</h3>

          {testsResult.initial && (
            <div className="result-section">
              <h4>Начальная модель:</h4>
              <pre className="model-display">
                {JSON.stringify(testsResult.initial, null, 2)}
              </pre>
            </div>
          )}

          {testsResult.afterEdit && (
            <div className="result-section">
              <h4>Модель после изменений:</h4>
              <pre className="model-display">
                {JSON.stringify(testsResult.afterEdit, null, 2)}
              </pre>

              <h4>Результаты тестов:</h4>
              <ul>
                <li>
                  Модель изменилась после редактирования:
                  <span
                    className={`test-status ${
                      testsResult.initialVsAfterEdit
                        ? "test-passed"
                        : "test-failed"
                    }`}
                  >
                    {testsResult.initialVsAfterEdit
                      ? " ПРОЙДЕН"
                      : " НЕ ПРОЙДЕН"}
                  </span>
                </li>
                <li>
                  Новый параметр добавлен в модель:
                  <span
                    className={`test-status ${
                      testsResult.hasNewParam ? "test-passed" : "test-pending"
                    }`}
                  >
                    {testsResult.hasNewParam
                      ? " ПРОЙДЕН"
                      : ' НЕ ПРОВЕРЕН (введите значение для поля "Материал")'}
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
