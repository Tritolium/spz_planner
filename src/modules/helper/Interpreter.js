const tokenize = input => input.match(/\d+|true|false|==|!=|<=|>=|<|>|\|\||&&|!|\(|\)|[a-zA-Z_]\w*/g)

function parse(tokens) {
    let position = 0

    const parseExpression = () => {
        let left = parseLogical()

        while (tokens[position] === '||') {
            const operator = tokens[position++]
            const right = parseLogical()
            left = { type: 'LogicalExpression', operator, left, right }
        }

        return left
    }

    const parseLogical = () => {
        let left = parseComparison()

        while (tokens[position] === '&&') {
            const operator = tokens[position++]
            const right = parseComparison()
            left = { type: 'LogicalExpression', operator, left, right }
        }

        return left
    }

    function parseComparison() {
        let left = parsePrimary();

        while (['==', '!=', '<', '>', '<=', '>='].includes(tokens[position])) {
            const operator = tokens[position++];
            const right = parsePrimary();
            left = { type: 'ComparisonExpression', operator, left, right };
        }

        return left;
    }

    function parsePrimary() {
        const token = tokens[position++];

        if (/\d+/.test(token)) {
            return { type: 'Literal', value: Number(token) };
        }

        if (token === 'true' || token === 'false') {
            return { type: 'Literal', value: token === 'true' };
        }

        if (/^[a-zA-Z_]\w*$/.test(token)) {
            // Variablenname erkannt
            return { type: 'Variable', name: token };
        }

        if (token === '(') {
            const expression = parseExpression();
            if (tokens[position++] !== ')') {
                throw new Error('Expected closing parenthesis');
            }
            return expression;
        }

        if (token === '!') {
            const right = parsePrimary();
            return { type: 'UnaryExpression', operator: '!', right };
        }

        throw new Error(`Unexpected token: ${token}`);
    }

    return parseExpression();
}

function evaluate(node, context) {
    // Kontext ist ein Objekt, z. B. { Schlagwerk: 3, Takt: 4 }
    switch (node.type) {
        case 'Literal':
            return node.value;

        case 'Variable':
            if (node.name in context) {
                return context[node.name];
            } else {
                return 0
            }

        case 'UnaryExpression':
            if (node.operator === '!') {
                return !evaluate(node.right, context);
            }
            throw new Error(`Unknown operator: ${node.operator}`);

        case 'ComparisonExpression':
            const left = evaluate(node.left, context);
            const right = evaluate(node.right, context);
            switch (node.operator) {
                case '==': return left === right;
                case '!=': return left !== right;
                case '<': return left < right;
                case '>': return left > right;
                case '<=': return left <= right;
                case '>=': return left >= right;
            }
            throw new Error(`Unknown operator: ${node.operator}`);

        case 'LogicalExpression':
            const leftVal = evaluate(node.left, context);
            if (node.operator === '||') {
                return leftVal || evaluate(node.right, context);
            }
            if (node.operator === '&&') {
                return leftVal && evaluate(node.right, context);
            }
            throw new Error(`Unknown operator: ${node.operator}`);
    }
}

// Beispiel:
const input = "Schlagwerk >= 2 && Takt == 4";
const tokens = tokenize(input);
const ast = parse(tokens);

// Beispiel-Kontext mit Variablen
const inst_array = {
    Schlagwerk: 3,
    Takt: 4,
    Stimmen: 2
};

// console.log("AST:", JSON.stringify(ast, null, 2));
// console.log("Result:", evaluate(ast, inst_array));

export const rateEvent = (attending, prob, maybe, rating) => {
    let result = 0
    const tokens = tokenize(rating);
    const ast = parse(tokens);

    let prediction = {}
    let prediction_maybe = {}

    // combine attending and prob in prediction
    for (let key in attending) {
        if (prob[key] !== undefined) {
            prediction[key] = attending[key] + prob[key]
        } else {
            prediction[key] = attending[key]
        }
    }

    for (let key in prob) {
        if (attending[key] === undefined) {
            prediction[key] = prob[key]
        }
    }

    // combine prediction and maybe in prediction_maybe
    for (let key in prediction) {
        if (maybe[key] !== undefined) {
            prediction_maybe[key] = prediction[key] + maybe[key]
        } else {
            prediction_maybe[key] = prediction[key]
        }
    }

    for (let key in maybe) {
        if (prediction[key] === undefined) {
            prediction_maybe[key] = maybe[key]
        }
    }

    if (evaluate(ast, attending)) {
        result = 3
    } else if (evaluate(ast, prediction)) {
        result = 2
    } else if (evaluate(ast, prediction_maybe)) {
        result = 1
    }

    return result
}