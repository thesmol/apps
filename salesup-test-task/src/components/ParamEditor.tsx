import React from "react";

/**
 * Интерфейс, представляющий параметр с идентификатором, названием и типом
 * @property {number} id - Уникальный идентификатор параметра
 * @property {string} name - Название параметра для отображения
 * @property {string} type - Тип параметра (в текущей реализации только "string")
 */
interface Param {
  id: number;
  name: string;
  type: "string"; // В текущей реализации поддерживается только строковый тип
}

/**
 * Интерфейс, представляющий значение параметра с соответствующим paramId
 * @property {number} paramId - Идентификатор параметра, к которому относится значение
 * @property {string} value - Значение параметра
 */
interface ParamValue {
  paramId: number;
  value: string;
}

/**
 * Интерфейс, представляющий определение цвета
 * Используется в интерфейсе Model
 * @property {number} id - Уникальный идентификатор цвета
 * @property {string} name - Название цвета
 */
interface Color {
  id: number;
  name: string;
  // Другие поля могут быть добавлены при необходимости
}

/**
 * Интерфейс, представляющий модель данных
 * Содержит значения параметров и цвета
 * @property {ParamValue[]} paramValues - Массив значений параметров
 * @property {Color[]} colors - Массив цветов
 */
interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

/**
 * Свойства для компонента ParamEditor
 * @property {Param[]} params - Массив определений параметров
 * @property {Model} model - Модель данных
 */
interface Props {
  params: Param[];
  model: Model;
}

/**
 * Состояние для компонента ParamEditor
 * @property {ParamValue[]} paramValues - Массив значений параметров
 */
interface State {
  paramValues: ParamValue[];
}

/**
 * Компонент ParamEditor
 * Позволяет редактировать значения параметров и получать обновленную модель
 */
class ParamEditor extends React.Component<Props, State> {
  /**
   * Конструктор инициализирует состояние значениями модели из свойств
   * @param {Props} props - Свойства компонента
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: [...props.model.paramValues],
    };
  }

  /**
   * Обновляет значение параметра при изменении пользователем
   * @param {number} paramId - ID параметра для обновления
   * @param {string} value - Новое значение параметра
   */
  handleParamChange = (paramId: number, value: string) => {
    this.setState((prevState) => {
      // Ищем параметр в текущем состоянии, если он существует
      const indexExistingValue = prevState.paramValues.findIndex(
        (parameterValue) => parameterValue.paramId === paramId
      );

      const updatedValues = [...prevState.paramValues];

      if (indexExistingValue !== -1) {
        // Обновляем существующий параметр
        updatedValues[indexExistingValue] = { paramId, value };
      } else {
        // Добавляем новый параметр
        updatedValues.push({ paramId, value });
      }

      return { paramValues: updatedValues };
    });
  };

  /**
   * Возвращает текущую модель с обновленными значениями параметров
   * Метод используется внешними компонентами для получения актуальной модели
   * @returns {Model} Обновленный объект Model
   */
  public getModel(): Model {
    return {
      ...this.props.model,
      paramValues: this.state.paramValues,
    };
  }

  /**
   * Получает значение параметра по его ID
   * @param {number} paramId - ID параметра
   * @returns {string} Значение параметра или пустая строка, если не найдено
   */
  private getParamValue(paramId: number): string {
    const parameterValue = this.state.paramValues.find(
      (value) => value.paramId === paramId
    );
    return parameterValue ? parameterValue.value : "";
  }

  render() {
    const { params } = this.props;

    return (
      <div className="param-editor">
        <h2 className="param-editor-title">Редактор параметров</h2>
        <div className="param-list">
          {params.map((parameter) => (
            <ParamInput
              key={parameter.id}
              param={parameter}
              value={this.getParamValue(parameter.id)}
              onChange={this.handleParamChange}
            />
          ))}
        </div>
      </div>
    );
  }
}

/**
 * Свойства для компонента ParamInput
 * @property {Param} param - Определение параметра
 * @property {string} value - Текущее значение параметра
 * @property {Function} onChange - Функция обратного вызова при изменении значения
 */
interface ParamInputProps {
  param: Param;
  value: string;
  onChange: (paramId: number, value: string) => void;
}

/**
 * Компонент для отображения и редактирования отдельного параметра
 * @param param - Определение параметра
 * @param value - Текущее значение параметра
 * @param onChange - Функция обратного вызова при изменении значения
 */
const ParamInput: React.FC<ParamInputProps> = ({ param, value, onChange }) => {
  /**
   * Обрабатывает события изменения в поле ввода
   * @param {React.ChangeEvent<HTMLInputElement>} e - Событие изменения из элемента ввода
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(param.id, e.target.value);
  };

  /**
   * Отображает соответствующий элемент ввода в зависимости от типа параметра
   * В настоящее время поддерживается только тип string, но компонент подготовлен к расширению
   * @returns Элемент ввода, соответствующий типу параметра
   */
  const showInputByType = () => {
    // В настоящее время поддерживается только строковый тип, но компонент готов к расширению
    switch (param.type) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={`Введите ${param.name.toLowerCase()}`}
          />
        );
      // Дополнительные типы могут быть добавлены здесь:
      // case 'number':
      //   return <input type="number" value={value} onChange={handleInputChange
      //   return <select value={value} onChange={...}>...</select>;
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={`Введите ${param.name.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="param-input">
      <label htmlFor={`param-${param.id}`}>{param.name}:</label>
      {showInputByType()}
    </div>
  );
};

/**
 * Пример компонента, демонстрирующего использование ParamEditor
 * Содержит тестовые данные и функцию для демонстрации работы с моделью
 */
const ExampleUsage: React.FC = () => {
  // Примерные данные из задания
  const testParameters: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" },
  ];

  const testModel: Model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
    ],
    colors: [], // Цвета могут быть пустыми в этом примере
  };

  // Ссылка для доступа к методам ParamEditor
  const editorRef = React.createRef<ParamEditor>();

  /**
   * Обработчик для демонстрации получения текущей модели
   * Выводит модель в консоль и показывает оповещение
   */
  const handleGettingModel = () => {
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel();
      console.log("Текущая модель:", currentModel);
      alert("Модель выведена в консоль");
    }
  };

  return (
    <div className="example-container">
      <ParamEditor ref={editorRef} params={testParameters} model={testModel} />
      <button onClick={handleGettingModel} className="example-button">
        Получить модель
      </button>
    </div>
  );
};

export { ParamEditor, ExampleUsage };
export type { Param, ParamValue, Model, Props, State };
